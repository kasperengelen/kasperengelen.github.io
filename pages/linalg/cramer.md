---
layout: page
title: Cramer's rule
permalink: /posts/linalg/cramer
exclude: true
referenceId: cramers_rule
sitemap:
    lastmod: 2024-07-29
---

<warning-box>
In this article we will be implementing a numerical linear algebra algorithm by hand. Note that this is purely for educational purposes. When doing practical work, always make sure to use existing libraries (e.g., NumPy, Eigen, Accelerate, ...). Since those libraries are widely used, they are also well tested and optimised and thus safe to use.
</warning-box>

<div>
{% include smart_cite/load_bib_file.html bib_file=site.data.bibliography_linalg_cramer %}
</div>

<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_linalg_cramer %}
</div>

<div>
{% include smart_link/load_internal_urls.html %}
</div>

## Contents

* TOC 
{:toc}

## Introduction

In this post we will talk about Cramer's rule, a technique for solving systems of linear equations. Such equations form the central object of linear algebra, and find applications in physics (fluid dynamics), electrical engineering (circuit analysis), machine learning, and digital communications (error correcting codes), to name a few. As such, many techniques have been developed to find solutions to such equations, such as Gaussian elimination, conjugate gradient methods, least squares, Jacobi iteration, etc.

In this article we will talk about Cramer's rule, which was discovered by <strong>Gabriel Cramer</strong>, as part of his book "Introduction à l'analyse des lignes courbes algébraique", published in 1750 <smart-cite bibId="cramers_rule_due_to_cramer"></smart-cite>, although some claim that it actually is <strong>Colin Maclaurin</strong> who invented the rule back in 1729 <smart-cite bibId="earlier_date_cramer"></smart-cite>. Today, however, this rule is expressed in modern and well-developed notation. As a result, it has become an easy to recall technique for solving systems of linear equations. 

<example>

We'll start with a small example. Let's consider a system of linear equations with 2 unknowns, and 2 equations:

<display-math>
\left\{
\begin{array}{*{3}{rC}l}
   a_{11} x_1 & + &  a_{12} x_2 & = & b_1 \\
   a_{21} x_1 & + &  a_{22} x_2 & = & b_2.
\end{array}
\right.
</display-math>

<p>In matrix notation this is written as $Ax = b$ with</p>

<display-math>
A = \begin{bmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{bmatrix},\quad b = \begin{bmatrix}
b_1 \\
b_2
\end{bmatrix},\quad x = \begin{bmatrix}
x_1 \\
x_2
\end{bmatrix}.
</display-math>

<p>To solve this system of equations, we will use Cramer's rule. For this we first need some more notation. Recall that $\det(A)$ is the determinant of $A$, and let $A[j \leftarrow b]$ be the matrix A with its $j$-th column replaced with the vector $b$:</p>

<display-math>
A[1 \leftarrow b] = \begin{bmatrix}
b_1 & a_{12} \\
b_2 & a_{22}
\end{bmatrix},\quad A[2 \leftarrow b] = \begin{bmatrix}
a_{11} & b_1 \\
a_{21} & b_2
\end{bmatrix}.
</display-math>

<p>We then have that the solution $x = \left[\begin{array}{@{}c@{}}
    x_{1} \\
    x_{2} 
    \end{array} \right]$ can be written as the fraction of determinants:</p>

<display-math>
x_1 = \frac{\det(A[1 \leftarrow b])}{\det(A)} = \frac{\begin{vmatrix}
b_1 & a_{12} \\
b_2 & a_{22}
\end{vmatrix}}{\begin{vmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{vmatrix}} = \frac{
b_1 a_{22} - b_2 a_{12}
}{
a_{11} a_{22} - a_{21} a_{12}
}
</display-math>

<display-math>
x_2 = \frac{\det(A[2 \leftarrow b])}{\det(A)} = \frac{\begin{vmatrix}
a_{11} & b_1 \\
a_{21} & b_2
\end{vmatrix}}{\begin{vmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{vmatrix}} = \frac{
a_{11} b_2 - a_{21} b_1
}{
a_{11} a_{22} - a_{21} a_{12}
}
</display-math>

Note that the formulas above for the determinant of a 2-by-2 matrix are due to the <smart-link linkType="ext" linkId="wiki_sarrus_rule">rule of Sarrus</smart-link>.

</example>

The advantage is that this trick is easy to remember. The downside is that Cramer's rule is not computationally efficient. Depending on the method that is used, computing a single determinant takes up to $\mathcal{O}(n!)$ operations and we have to compute $n+1$ different determinants. For comparison: finding all solutions can be done by applying Gaussian elimination just once, which takes $\mathcal{O}(n^3)$ arithmetic operations in total.

In the rest of the article we will first investigate why Cramer's rule actually works. In doing so we will explore two different proofs. Afterwards we will implement this technique in Swift, making use of our matrix class from the previous article. Finally, we will thoroughly unit test our code on examples generated using NumPy in Python.

## Theory

In this section we will provide some insights as to why and how Cramer's rule actually works. In <smart-ref targetType="thm" targetId="cramers_rule" includeEnvName="true"></smart-ref> we will give the formal statement for square matrices of arbitrary size. Then, we will consider two proofs:
1. a first proof that uses a neat trick that involves identity matrices,
2. a second proof that leverages the relation between the inverse and adjugate of a matrix.

In these proofs we will find out how replacing columns of matrices leads to solutions, and how those columns interact with determinants. Given that formulas involving determinants can be quite dense and difficult to interpret, we will make use of the easy-to-understand <smart-link linkType="ext" linkId="wiki_sarrus_rule">rule of Sarrus</smart-link> for 2-by-2 and 3-by-3 matrices.


### Formal statement

We will now turn the example from the introduction into a general statement. Recall from the example above that we write $A[j \leftarrow b]$ to mean the matrix $A$ with its $j$-th column replaced by $x$, and that by $\det(A)$ we mean the <em>determinant</em> of the matrix $A$.

<theorem envId="cramers_rule" envName="Cramer's rule">
Let $A$ be a non-singular $n$-by-$n$ matrix and let $b$ be a vector with $n$ elements. The system of equations given by
<display-math>
Ax = b,
</display-math>
has a unique solution $x$ such that the $j$-th element of $x$ is given by 
<display-math>
x_j = \frac{\det(A[j \leftarrow b])}{\det(A)},\text{ with } 1 \leq j \leq n.
</display-math>
</theorem>

### Proof 1

In the first proof we will make use of a clever trick I found in the book "Differential Equations and Linear Algebra" by Grant B. Gustafson <smart-cite bibId="gustafson_diff_eq"></smart-cite>. This proof is also present in other sources <smart-cite bibId="six_proofs_cramer"></smart-cite>. This trick involves taking the identity matrix, and replacing one of its columns with our vector of unknowns $x$. We will first illustrate this trick with two small examples, and then make use of this trick in the full proof below.

<example envName="2-by-2 matrix">

<p>Let us first consider a 2-by-2 matrix. We then have the following system of linear equalities:</p>

<display-math>
\left\{
\begin{array}{*{3}{rC}l}
   a_{11} x_1 & + &  a_{12}x_2 & = & b_1 \\
   a_{21} x_1 & + &  a_{22}x_2 & = & b_2.
\end{array}
\right.
</display-math>

<p>In matrix notation this is </p>

<display-math>
\begin{bmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{bmatrix} \times \begin{bmatrix}
x_1 \\
x_2
\end{bmatrix} = \begin{bmatrix}
b_1 \\
b_2
\end{bmatrix}
</display-math>

<p>Let us now rewrite this equation using $I_2[1 \leftarrow x]$, which is the identity matrix with its first column replaced by $x$:</p>

<display-math>
\begin{bmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{bmatrix} \times \begin{bmatrix}
x_1 & 0 \\
x_2 & 1
\end{bmatrix} \stackrel{*}{=} \begin{bmatrix}
b_1 & a_{12} \\
b_2 & a_{22}
\end{bmatrix}
</display-math>

<p>We can now see the matrix $A[1 \leftarrow b]$ appear on the right-hand-side (RHS). To see why the equality (*) is true, we'll have to take a closer look at how matrix multiplication is performed. In matrix multiplication, the matrix on the RHS is constructed element by element: </p>

<display-math>
\begin{bmatrix}
a_{11} x_1 + a_{12} x_2 & a_{11} \cdot 0 + a_{12} \cdot 1 \\
a_{21} x_1 + a_{22} x_2 & a_{21} \cdot 0 + a_{22} \cdot 1
\end{bmatrix} = \begin{bmatrix}
b_1 & a_{12} \\
b_2 & a_{22}
\end{bmatrix}
</display-math>

<p>Finally, we can turn $I_2[1 \leftarrow x]$ into $x_1$ by taking the determinant:</p>

<display-math>
\det(I_2[1 \leftarrow x]) = \begin{vmatrix}
x_1 & 0 \\
x_2 & 1
\end{vmatrix} = x_1 \cdot 1 - x_2 \cdot 0 = x_1
</display-math>

<p>To conclude, if we have that $Ax = b$, then we also have that $A \times I_2[1 \leftarrow x] = A[1 \leftarrow x]$ and that $\det(I_2[1 \leftarrow x]) = x_1$. This means that by using this trick, we might have a way to introduce the matrix $A[j \leftarrow b]$ and to extract individual solutions $x_j$ to our system of linear equations!</p>
</example>

<example envName="3-by-3 matrix">

<p>In the next example, we will consider a 3-by-3 matrix, and try to apply our trick using a different column. We once again consider a system of linear equalities and its matrix form:</p>

<display-math>
\left\{
\begin{array}{*{3}{rC}l}
   a_{11} x_1 & + & a_{12}x_2 & + & a_{13}x_3 & = & b_1 \\
   a_{21} x_1 & + & a_{22}x_2 & + & a_{23}x_3 & = & b_2 \\
   a_{31} x_1 & + & a_{32}x_2 & + & a_{33}x_3 & = & b_3
\end{array}
\right.
</display-math>

<display-math>
\begin{bmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{bmatrix} \times \begin{bmatrix}
x_1 \\
x_2 \\
x_3
\end{bmatrix} = \begin{bmatrix}
b_1 \\
b_2 \\
b_3
\end{bmatrix}
</display-math>

If we use $I_3[2 \leftarrow x]$ to rewrite the equation, we once again see $A[2 \leftarrow b]$ appear on the RHS, similar to the previous example:

<display-math>
\begin{bmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{bmatrix} \times \begin{bmatrix}
1 & x_1 & 0 \\
0 & x_2 & 0 \\
0 & x_3 & 1
\end{bmatrix} = \begin{bmatrix}
a_{11} & b_1 & a_{13} \\
a_{21} & b_2 & a_{23} \\
a_{31} & b_3 & a_{33}
\end{bmatrix}.
</display-math>

<p>Note that this is different from the previous example. That is, we are replacing the columns of a 3-by-3 identity matrix instead of 2-by-2, and this time we are replacing the second column instead of the first.</p>

<p>Finally, we need to have that $\det(I_3[2 \leftarrow x]) = x_2$. This is easy to see, since the rule of Sarrus sums up the products of the elements on the diagonals of the matrix. All diagonals of $I_3[2 \leftarrow x]$ have a 0 in them, except one single diagonal that contains $x_2$. Furthermore, that diagonal only contains 1s. Therefore the resulting determinant will be equal to $x_2$.</p>
</example>

<p>From these two examples we can convince ourselves that this trick works for any matrix $A$ of arbitrary size $n$ and for an arbitrary column $j \in \{1, \dots, n\}$. We can formalise this trick involving identity matrices with the following two lemmas:</p>

<lemma envId="col_replacement_rewrite" envName="introducing column replacement">
Let $A$ be a square matrix of size $n$, and let $x$ and $b$ be vectors with $n$ components. If $Ax = b$, then for all $j \in \{1, \dots, n\}$:
<display-math>A \times I_n[j \leftarrow x] = A[j \leftarrow b].</display-math>
</lemma>

<lemma envId="ident_matrix_col_repl" envName="extracting $x_j$">
Let $n \in \mathbb{N}$, let $I_n$ be the $n$-by-$n$ identity matrix, and let $x$ be a vector with $n$ components. For all $j \in \{1, \dots, n\}$:
<display-math>
\det(I_n[j \leftarrow x]) = x_j.
</display-math>
</lemma>

Finally, we will use one last helper lemma in the proof. This will allow us to easily work with determinants of products of matrices:

<lemma envId="det_product_rule" envName="Product Rule for determinants">
Let $A$ and $B$ by $n$-by-$n$ matrices. We then have that
<display-math>
\det(A \times B) = \det(A) \cdot \det(B).
</display-math>
</lemma>

<proof>
See Theorem 5.19 of the book "Differential Equations and Linear Algebra" by Grant B. Gustafson <smart-cite bibId="gustafson_diff_eq"></smart-cite>. This is a clever proof that uses elementary matrices.
</proof>


We will now use these two tricks in the following proof of <smart-ref targetType="thm" targetId="cramers_rule" includeEnvName="true"></smart-ref>:

<proof envName="Theorem 1" envId="proof1_cramer">
Since the matrix $A$ is non-singular, we trivially have that there is a unique solution $x$. Furthermore, for all $j \in \{1, \dots, n\}$, we can deduce that:
<display-math>
\begin{aligned}
&A x = b \\
\iff & A \times I_n[j \leftarrow x] = A[j \leftarrow b]
&\text{(Due to lemma 1.)} \\
\iff & \det(A \times I_n[j \leftarrow x]) = \det(A[j \leftarrow b]) \\
\iff & \det(A) \cdot \det(I_n[j \leftarrow x]) = \det(A[j \leftarrow b])
&\text{(Product rule.)} \\
\iff & \det(A) \cdot x_j = \det(A[j \leftarrow b])
&\text{(Due to lemma 2.)} \\
\iff & x_j = \frac{\det(A[j \leftarrow b])}{\det(A)}
&\text{(Since $\det(A)$ is non-zero.)}
\end{aligned}
</display-math>
</proof>

In the above proof we first formalised our notion of "replacing columns" by encoding this replacement operation as a matrix. This means that instead of replacing some arbitrary elements in a matrix, we are instead applying a matrix to another matrix, similar to the elementary matrices used in Gaussian elimination. This, in turn, allowed us to leverage the product rule to pull apart the determinants and extract $x_j$. 

We can see that when proving the correctness of techniques such as Cramer's rule, it very much pays off to first formalise the arithmetical tricks we use as part of these techniques. This then allows us to do the rest of the proof using simple algebra.

### Proof 2

In the next proof we will make use of the relation between systems of linear equations, the inverse of a matrix, and the adjugate of a matrix. This proof is more conventional than the previous proof since most of the time the adjugate matrix is used to prove Cramer's rule <smart-cite bibId="six_proofs_cramer"></smart-cite>.

If we have a system of equations $Ax = b$ with a unique solution $x$, then we also have that $x = A^{-1}b$, where $A^{-1}$ is the <em>inverse</em> of the matrix $A$. Next, we note that there is an important relation between the inverse $A^{-1}$ and the <em>adjugate</em> of the matrix $\adj(A)$:

<display-math>
A^{-1} = \frac{1}{\det(A)}\adj(A).
</display-math>

The adjugate of a matrix is sometimes also called the "adjoint" or "adjunct". The adjugate of a matrix is a bit more involved and it is in turn defined in terms of determinants. More precisely it is the transpose of the matrix of co-factors, with each co-factor being the determinant of a sub-matrix of $A$ multiplied by either $1$ or $-1$. We will illustrate this with an example:

<example envName="Example: Adjugate matrix">
Let us consider the following matrix:
<display-math>
A = \begin{bmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{bmatrix}.
</display-math>

<p>Its co-factor matrix is</p>

<display-math>
C(A) = \begin{bmatrix}
C_{11} & C_{12} & C_{13} \\
C_{21} & C_{22} & C_{23} \\
C_{31} & C_{32} & C_{33}
\end{bmatrix}
</display-math>

<p>with $C_{ij}$ being the determinant of the $(i,j)$-minor of $A$ times $(-1)^{i+j}$. The $(i,j)$-minor of $A$ is simply the matrix $A$ with its $i$-th row and $j$-th column removed. The co-factor $C_{31}$ is, for example, equal to </p>

<display-math>
C_{31} = (-1)^{3+1} \det \begin{bmatrix}
\square & a_{12} & a_{13} \\
\square & a_{22} & a_{23} \\
\square & \square & \square
\end{bmatrix} = \det \begin{bmatrix}
a_{12} & a_{13} \\
a_{22} & a_{23}
\end{bmatrix} = a_{12} a_{23} - a_{13} a_{22}.
</display-math>

The adjugate matrix of $A$ is then the transpose of the co-factor matrix:

<display-math>
\adj(A) = \begin{bmatrix}
C_{11} & C_{12} & C_{13} \\
C_{21} & C_{22} & C_{23} \\
C_{31} & C_{32} & C_{33}
\end{bmatrix}^T = \begin{bmatrix}
C_{11} & C_{21} & C_{31} \\
C_{12} & C_{22} & C_{32} \\
C_{13} & C_{23} & C_{33}
\end{bmatrix}.
</display-math>
</example>

From the example above it is clear that there is a strong link between between the adjugate of a matrix and determinants. Given that the inverse of a matrix can be expressed in terms of determinants and the adjugate matrix, this suggests that we could use determinants of matrices to solve systems of linear equations. 

One final tool that involves the determinant, is the <em>co-factor expansion</em>, also called the <em>Laplace expansion</em> after Pierre-Simon Laplace, that can be used to define the determinant:

<lemma envName="Co-factor expansion">
Given an $n$-by-$n$ matrix $A$, we have that for any $j$-th column:
<display-math>\det(A) = \sum_{i=1}^n a_{ij} A_{ij}.</display-math>
</lemma>

To put it more concretely: we can choose an arbitrary column $j$ of a matrix, and use it together with the co-factors in the $j$-th column of the co-factor matrix in order to obtain the determinant of a matrix. Note that these co-factors do not make use of any elements in the $j$-th column of the original matrix.

In the following proof of <smart-ref targetType="thm" targetId="cramers_rule" includeEnvName="true"></smart-ref> we will leverage the link between the inverse and adjugate of a matrix, and we will see that there is an interesting interplay between the co-factor expansion and the column-replacement technique from Cramer's rule:

<proof envId="proof2_cramer" envName="Theorem 1">

<p>We first re-write $x$ in terms of the adjugate matrix:</p>

<display-math>
\begin{aligned}
     &Ax = b \\
\iff &x = A^{-1} b \\
\iff &x = \frac{1}{\det(A)} \adj(A) b \\
\iff &x = \frac{1}{\det(A)}\begin{bmatrix}
             (\adj(A) b)_1 \\
             (\adj(A) b)_2 \\
             \dots \\
             (\adj(A) b)_n
          \end{bmatrix} \\
\iff &x_j = \frac{(\adj(A) b)_j}{\det(A)},\,\text{for all }j \in \{1, \dots, n\}
\end{aligned}
</display-math>

<p>In order to prove <smart-ref targetType="thm" targetId="cramers_rule" includeEnvName="true"></smart-ref>, it remains to be shown that for all $j \in \{1, \dots, n\}$:</p>

<display-math>
(\adj(A) b)_j = \det(A[j \leftarrow b]).
</display-math>

<p>In order to demonstrate this, we will have to look at how the contents of the adjugate matrix interact with matrix multiplication:</p>

<display-math>
\mathrm{adj}(A)b = \begin{bmatrix}
A_{11} & A_{21} & \dots & A_{n1} \\
A_{12} & A_{22} & \dots & A_{n2} \\
\dots & \dots & \dots & \dots \\
A_{1n} & A_{2n} & \dots & A_{nn}
\end{bmatrix} \times \begin{bmatrix}
b_{1} \\
b_{2} \\
\dots \\
b_{3}
\end{bmatrix} = \begin{bmatrix}
\sum_{i=0}^n A_{i1} b_i \\
\sum_{i=0}^n A_{i2} b_i \\
\dots \\
\sum_{i=0}^n A_{in} b_i
\end{bmatrix} \stackrel{*}{=}  \begin{bmatrix}
\det(A[1 \leftarrow b]) \\
\det(A[2 \leftarrow b]) \\
\dots \\
\det(A[n \leftarrow b])
\end{bmatrix}
</display-math>

<p>The equality (*) follows from the co-factor expansion of $A[j \leftarrow b]$:</p>

<display-math>
\det(A[j \leftarrow b]) = \sum_{i=1}^n b_{i} A_{ij},
</display-math>

<p>since we are taking the co-factor expansion over the $j$-th column of $A[j \leftarrow b]$, which is equal to the vector $b$ times the $j$-th row of the adjugate matrix of $A$.</p>
</proof>

In this second proof we leveraged two things:
1. The relation between the inverse of the adjugate of a matrix, thus re-phrasing solutions $x$ in terms of determinants,
2. the relation between the co-factor expansion and the rows and columns of a matrix, thus making the link between determinants and column replacement.

One can easily see that the second proof is a bit more involved than the first proof. Nonetheless, both of these are full proofs in their own right and they both prove Cramer's rule. This goes to show that, depending on your background and reasoning style, it pays of to consider different proofs for the same theorem, even for simple techniques such as Cramer's rule.

## Implementation

Now that we fully understand how and why Cramer's rule works, we will implement this in Swift. In the <smart-link linkType="int" linkId="linalg_matrix_class">previous tutorial</smart-link> we implemented a Matrix data structure, and we will make use of it in this tutorial as well.

A number of routines will have to be implemented in order to make Cramer's rule work:
- Retrieving the minor of a matrix, by removing a column and a row.
- Computing the determinant using the co-factor expansion.
- Replacing a column in the matrix.
- Computing each element of the solution $x$.

We will begin by creating a new extension for our Matrix class. In this tutorial we will only be considering Matrices with numerical elements (e.g., integer, float).

```swift
/// Extension for solving systems of linear equations using Cramer's rule.
public extension Matrix where ElementType: FloatingPoint {

    // ...

}
```

In order to obtain the minor matrix, we'll have to remove one row and one column. For this, we create a method in which we iterate over the elements of old matrix, and add the elements one-by-one to the new matrix. All elements that belong to the skipped row or column are not added. Note that we iterate in column-major order and call the appropriate initialiser on the array of elements we created.

```swift
/// Create a copy of the matrix without the specified row and column.
func minorMatrix(skipRow: Int, skipCol: Int) -> Matrix<ElementType> {
    var newElems: [ElementType] = []
    newElems.reserveCapacity((self.nRows-1)*(self.nCols-1))

    // add elements of the old matrix to the new matrix in column-major order
    for col in 0..<self.nCols {
        for row in 0..<self.nRows {
            // skip all elements on the specified row and column
            if col == skipCol || row == skipRow {
                continue
            }

            newElems.append(self[row, col])
        }
    }

    return Matrix(elementsColMajor: newElems, numCols: self.nCols-1)
}
```

Now that we can compute the minor matrix, we can use this to compute the determinant using the co-factor expansion. Recall that the co-factor expansion over the $i$-th row is defined as

<display-math>
\det(A) = \sum_{j=1}^n (-1)^{i+j} \det(A_{(i,j)}) a_{ij},
</display-math>

where $A_{(i,j)}$ is the minor matrix of $A$ for row $i$ and column $j$. Note that the co-factor expansion is a recursive formula: in order to compute the determinant of a square matrix of size $n$, we need to compute the determinants of matrices with size $n-1$. For the base-case we will check if the matrix has size $2$ and apply the rule of Sarrus.

```swift
/// Compute the determinant by taking the co-factor expansion 
///     over the specified row
func determinant(rowNr: Int = 0) -> ElementType {
    // determinant is only defined for square matrices
    precondition(self.nRows == self.nCols)

    if(self.nRows == 2) {
        // rule of Sarrus
        return self[0,0] * self[1,1] - self[0,1] * self[1,0]
    } else {
        var determinant: ElementType = 0

        // compute the co-factors
        for col in 0..<self.nCols {
            // compute determinant of the minor matrix
            let subMatrix = self.minorMatrix(skipRow: rowNr, skipCol: col)
            let subDet = subMatrix.determinant()

            // sign depends on whether row and col numbers are even/uneven
            if((rowNr + col) % 2 == 0) {
                // add the co-factor to the determinant
                determinant += self[rowNr, col] * subDet
            } else {
                determinant -= self[rowNr, col] * subDet
            }
        }

        return determinant
    }
}
```

Aside from computing determinants, Cramer's rule requires that we replace columns of matrices. In the `setColumn` method we will implement a simple for-loop that re-assigns all elements in the specified column.

```swift
/// Modify the matrix to replace the specified column with the values
mutating func setColumn(col: Int, newValue: [ElementType]) -> Self {
    // sizes of the matrix and the new column need to match
    precondition(newValue.count == self.nRows)

    for row in 0...newValue.count-1 {
        self[row, col] = newValue[row]
    }

    return self
}
```

For easy of use, we will also implement a method that first copies the matrix and then replaces the column, leaving the original matrix unmodified.

```swift
/// Return a new matrix with the same value except that the specified column has been replaced.
func withColumnReplaced(col: Int, newValue: [ElementType]) -> Matrix<ElementType> {
    // sizes of the matrix and the new column need to match
    precondition(newValue.count == self.nRows)

    // copy
    var newMatrix = self

    return newMatrix.setColumn(col: col, newValue: newValue)
}
```

<p>Now that we have all the ingredients, the only thing that remains is to implement Cramer's rule itself. Recall that for all $i \in \{ 1, \dots, n \}$:</p>

<display-math>
    x_i = \frac{\det(A[i \leftarrow b])}{\det(A)}.
</display-math>

This can be implemented with a simple for-loop, in which we call the methods we implemented earlier:

```swift
/// Solve the system A*x = b for the specified vector b using Cramer's rule.
func solveWithCramer(b: [ElementType]) -> [ElementType] {
        // the vector b needs to have the same size as A.
        precondition(b.count == self.nRows)

        // reserve space for the solution vector
        var x: [ElementType] = []
        x.reserveCapacity(self.nRows)

        let detA = self.determinant()

        // apply Cramer's rule for every element of x.
        for i in 0..<self.nCols {
            let Ai = self.withColumnReplaced(col: i, newValue: b)
            let detAi = Ai.determinant()

            x.append(detAi / detA)
        }

        return x
}
```

## Tests

Once the implementation is complete, it is essential to thoroughly test the code on various test cases. We will first implement some tests for the determinants, afterwards we will test the solutions computed using Cramer's rule. For more information on unit testing in Swift, you can read <smart-link linkType="int" linkId="swift_package_manager">the earlier article on Swift</smart-link>.

In order to make our life easier, we will use a Python library called NumPy to automatically generate matrices we can use during testing.

### Tests for the determinants

In order to test the determinant, we will take a few matrices of different sizes and compute their determinants. Randomly generating a matrix can be done easily using NumPy by generating random numbers in a `(size, size)` shape. The determinant can be computed using `np.linalg.det()`. Note that in order to make our tests more interesting, we made the elements of the matrix bigger, which gives bigger determinants.

```python
import numpy as np

def print_determinants(size):
    """
        Print some matrices and their determinants.
    """
    mat_rand = np.random.random((size, size))

    # scale the matrix to get more interesting results
    mat_rand_scale = np.array([
        [(elem*50)-25 for elem in row]
        for row in mat_rand
    ])

    print("Matrix:", [list(row) for row in mat_rand_scale])
    
    print("Det:", np.linalg.det(mat_rand_scale))
```

Implementing the asserts is easy. We copy the matrices generated by our script into our Swift code, and call the `determinant` method we implemented earlier. Using `XCTAssertEqual` we can check whether the value is correct.

```swift
import XCTest
@testable import LinAlgTutorials

/// Tests for determinants
final class MatrixDeterminantTests: XCTestCase {
    public func testDeterminant() {
        let mat = Matrix(rows: [
            [12.695521965890869, 10.769066787157136], 
            [-16.43710346047314, 17.13147349150045]])
        XCTAssertEqual(mat.determinant(), 394.5052629726679, accuracy: 0.00001)
    }
}
```

Note that we have to specify the accuracy of our comparison, since we are comparing floats and not integers.

### Generating non-singular matrices

Testing whether our implementation of Cramer's rule correctly solves a system of linear equations is a bit more complicated. While the determinant can be computed for any matrix $A$, solving a system of equations is only possible if $A$ is non-singular. Non-singular means that a matrix has a non-zero determinant and that the inverse $A^{-1}$ exists <smart-cite bibId="wiki_invertible"></smart-cite>.

In order to find such non-singular matrices, we will make use of <em>orthogonal</em> matrices. In such a matrix, all pairs of columns are orthogonal, with their dot-product being equal to zero <smart-cite bibId="wiki_orthogonal"></smart-cite>. Formally speaking, this is defined as follows:

<definition envName="Orthogonal matrix">
A matrix $Q$ with columns $c_1, \dots, c_n$ is orthogonal if its columns are orthonormal. Formally,

<display-math>
   \forall i, j \in \{ 1, \dots, n \}: c_i \cdot c_j =\begin{cases}
    1 & \text{if } i = j  \\ 
    0 & \text{otherwise.}
\end{cases}
</display-math>
</definition>

Orthogonal matrices have the useful property that they are always invertible, which is exactly what we need. Formally:

<lemma envName="Orthogonal matrices are invertible">
For all orthogonal matrices we have that $Q^TQ = I_n$ and therefore $Q^{-1} = Q^T$.
</lemma>

<proof>
The lemma above is trivially true if we consider that multiplying the transpose of $Q$ with $Q$ essentially amounts to taking the dot product of columns $c_i$ and $c_j$, for every combination of $i$ and $j$. The elements on the diagonal of the resulting matrix will have $i=j$ while all other entries have $i \neq j$. The resulting matrix is the identity matrix with ones on the diagonal and all entries equal to zero.
</proof>

The QR-decomposition of a matrix $A$ will produce two matrices $Q$ and $R$ such that $Q \times R = A$. The matrix $Q$ is orthogonal. By the lemma above, the matrix $Q$ will be non-singular and therefore suitable for Cramer's rule. Given that any square real-valued matrix $A$ can be decomposed using this method, we have thus found a method of randomly generating non-singular matrices!

This procedure of generating matrices can be summarised in the following steps:
1. Create a $n$-by-$n$ matrix $A$ by generating random numbers.
2. Obtain an orthogonal matrix $Q$ by applying the QR decomposition to $A$.
3. Generate a random vector $b$ with $n$ components.

The steps above will give us an unlimited supply of non-singular matrices of different sizes. In order to establish a <em>ground truth</em> we will also need to compute the solution $x$ such that $Qx = b$. This ground truth will be used when writing asserts, such that we can tell if the output of our Swift code is correct. The full Python code can be found below.

```python
import numpy as np

def print_cramer_test_cases(size):
    """
        Print some examples of systems of linear equations and their solutions.
    """

    # create matrix and make it orthogonal
    X = np.random.random((size, size))
    Q, _ = np.linalg.qr(X)

    # print matrix
    print("Matrix:")
    print([ list(row) for row in Q])

    # generate vector b
    b = np.random.random((size, 1))
    print("Vector b:")
    print([ row[0] for row in b])

    # obtain the actual solution
    x = np.linalg.solve(Q, b)
    print("Solution x:")
    print([ row[0] for row in x])
```

If we run our Python script with `size=3`, we get the following result:

<display-math>
Q = \begin{bmatrix}
-0.864\dots & 0.383\dots & -0.324\dots \\
-0.401\dots & -0.915\dots & -0.009\dots \\
-0.300\dots & 0.122\dots & 0.945\dots \\
\end{bmatrix},\quad b = \begin{bmatrix} 
 0.533\dots \\  
0.566\dots \\
0.422\dots
 \end{bmatrix},\quad x = \begin{bmatrix} 
-0.816 \dots \\  
-0.262 \dots \\
0.221 \dots
 \end{bmatrix}.
</display-math>

### Implementing the asserts

Once we have all the orthogonal matrices, vectors $b$, and corresponding solutions $x$, we can easily implement the necessary tests by simply calling the `solveWithCramer` method, and then comparing each element of the solution vector.

```swift
import XCTest
@testable import LinAlgTutorials

/// Tests for Cramer's rule
final class MatrixCramerTests: XCTestCase {
    public func testCramer() {
        let mat = Matrix(rows: [
            [-0.682722791904605, -0.730677486593081],
            [-0.730677486593081, 0.6827227919046047]
        ])
        let b = [0.86345338, 0.08052696]
        let solution = mat.solveWithCramer(b: b)
        XCTAssertEqual(solution[0], -0.64833854, accuracy: 0.00001)
        XCTAssertEqual(solution[1], -0.57592836, accuracy: 0.00001)
    }
}
```

## Conclusion

In this article we explored Cramer's rule, an easy to remember formula for solving systems of linear equations. We first covered the theoretical foundations of this technique by proving its correctness in two different ways. Afterwards we implemented Cramer's rule in Swift. Finally, we used NumPy and some linear algebra theory to automatically generate test cases which were then implemented using Swift.

On GitHub you can find the <smart-link linkType="ext" linkId="code_linalg">full implementation</smart-link>, including more unit tests. The file `Matrix+Cramer.swift` contains the implementation, the files `MatrixDeterminantTests.swift` and `MatrixCramerTests.swift` contain the tests for the determinants and Cramer's rule, respectively.

More articles on linear algebra and computing in general will follow, so stay tuned!

## References

<bibliography>
</bibliography>

