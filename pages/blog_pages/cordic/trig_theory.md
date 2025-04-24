---
layout: page
title: Trigoniometry using CORDIC
permalink: /posts/cordic/trig_theory
referenceId: cordic_trig_theory
exclude: true
---

<div>
{% include smart_cite/load_bib_file.html bib_file=site.data.bibliography_cordic %}
</div>

<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_cordic %}
</div>

<div>
{% include smart_link/load_internal_urls.html %}
</div>

## Introduction

In this article we will explore the theory behind the CORDIC algorithm, which stands for **CO**ordinate **R**otation **DI**gital **C**omputer. This algorithm was invented by Jack E. Volder in 1956 while working on navigation computers for planes, and it allows for computing various functions such as sine and cosine. One of the big benefits is that it only makes use of fixed-point addition and shifts which are computationally cheap.

The algorithm has many operating modes and can compute various things ranging from trigonometric functions all the way to eigenvalues. For now, we will only be considering the circular "rotation mode" of the algorithm, which can be used to compute the sine and cosine of an angle.

## Contents

* TOC 
{:toc}

## Overview of the algorithm

The algorithm iteratively approximates the sine and cosine of a given angle. It does so by maintaining and updating variables $x$ and $y$ such that after $n$ iterations $x$ and $y$ contain the approximated cosine and sine, respectively, of a given input angle $\theta$.

The variables $x$ and $y$ have initial values $x_0 = K_n$ and $y_0 = 0$, which corresponds to a vector with angle equal to 0 and length $K_n = \prod_{i=0}^{n-1} \frac{1}{\sqrt{1 + 2^{-2i}}}$. This vector is then repeatedly rotated until a vector is obtained whose angle is close to the input $\theta$. Additionally, a third variable $\theta$ is used to keep track of how many rotations still need to be performed.

All this can be summarised using the following system of equations. The variables $x$, $y$, and $\theta$ are iteratively updated such that after the $i$-th step their values are $x_{i+1}$, $y_{i+1}$, and $\theta_{i+1}$, respectively, for $n$ steps $i \in \\{0, \dots, n-1\\}$. 

<p>
Initialisation:
<display-math>
\begin{align*}
x_{0} &= K_n, \\
y_{0} &= 0, \\
\theta_{0} &= \theta.
\end{align*}
</display-math>
If $\theta_{i} \geq 0$, then
<display-math>
\begin{align*}
x_{i+1} &= x_{i} - y_{i} \cdot 2^{-i} \\
y_{i+1} &= y_{i} + x_{i} \cdot 2^{-i} \\
\theta_{i+1} &= \theta_{i} - \arctan 2^{-i},
\end{align*}
</display-math>
otherwise,
<display-math>
\begin{align*}
x_{i+1} &= x_{i} + y_{i} \cdot 2^{-i} \\
y_{i+1} &= y_{i} - x_{i} \cdot 2^{-i} \\
\theta_{i+1} &= \theta_{i} + \arctan 2^{-i}.
\end{align*}
</display-math></p>

The algorithm works for both floating-point and fixed-point. The latter is a major advantage of CORDIC, since this allows it to be implemented using only additions and bit-shifts. Also note that the values $\arctan 2^{-i}$ for $i \in \\{ 0, \dots, n-1 \\}$ can be computed beforehand.

<p>
Once $x_n$ and $y_n$ have been computed in iteration $n-1$, they will be equal to 

<display-math>
x_n = \cos \hat{\theta}\text{ and } y_n = \sin \hat{\theta}, 
</display-math>
where $\hat{\theta} \approx \theta$.
</p>

When implemented using binary numbers, the algorithm works for any angle $\theta \in \[-1.7432\dots, 1.7432\dots \]$ specified in radians. This corresponds to about $\pm 99^{\circ}$. This limited input range is due the convergence properties, which rely on the fact that a vector can be rotated in multiple small steps. Any angle outside the input domain will require too many rotations and will therefore not converge, not even for an infinite amount of iterations.

In the animation below, we can see that the CORDIC algorithm will iteratively construct vectors that are closer and closer to a vector that has the desired angle.

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/animated_with_pause.gif">
            <figcaption>Animation of the CORDIC algorithm.</figcaption>
        </figure>
    </div>
</div>

## Deriving the algorithm

In this section we will derive the formulas above, starting from first principles.


### Trigonometry on the unit circle

The CORDIC algorithm is based on the principles of trigonometry. If we consider the unit circle (i.e., the circle with radius 1), then we have that a vector $\vec{v}(\theta)$ with angle $\theta$ has coordinates
<display-math>
\vec{v}(\theta) = \begin{bmatrix} \cos \theta \\ \sin \theta \end{bmatrix}.
</display-math>

So in order to obtain the cosine and sine of an angle $\theta$, we could take a vector with angle 0 and length 1, rotate it with an angle $\theta$, and then retrieve the $x$ and $y$ components from the new vector. This is illustrated below:

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/sin_cos_circle.svg">
            <figcaption>Relation between sine, cosine, and angle $\theta$ on the unit circle.</figcaption>
        </figure>
    </div>
</div>



### Rotation matrices

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/angle_rot.svg">
            <figcaption>Illustration of a rotated vector.</figcaption>
        </figure>
    </div>
</div>

We will now need to find a way to rotate vectors. For this we can use a so-called <em>Givens rotation matrix</em> which will take a vector and rotate it with the desired angle. Formally, this can be stated using the following lemma:

<lemma envName="Givens rotation matrix" envId="givens_matrix">
Given vectors $\vec{v}(\alpha) = (\cos \alpha, \sin \alpha)$ and $\vec{v}(\alpha + \beta) = (\cos \alpha + \beta, \sin \alpha + \beta)$ we have that

<display-math>
    M(\beta) \vec{v}(\alpha) = \vec{v}(\alpha + \beta),
</display-math>

where $M(\beta)$ is the Givens rotation matrix for angle $\beta$, given by

<display-math>
M(\beta) = \begin{bmatrix}
\cos \beta & -\sin \beta \\
\sin \beta & \cos \beta
\end{bmatrix}.
</display-math>
</lemma>

<proof>
We can re-write the vector $\vec{v}(\alpha + \beta)$ using the following two trigonometric identities

<display-math>
\begin{align*}
\cos \alpha + \beta &= \cos \alpha \cos \beta - \sin \alpha \sin \beta \\
\sin \alpha + \beta &= \cos \alpha \sin \beta + \sin \alpha \cos \beta.
\end{align*}
</display-math>

If we plug all of this into the matrix multiplication we can see that

<display-math>
\begin{align*}
&\begin{bmatrix}
\cos \beta & -\sin \beta \\
\sin \beta & \cos \beta
\end{bmatrix} \times \begin{bmatrix}
\cos \alpha \\
\sin \alpha
\end{bmatrix} \\

&= \begin{bmatrix}
\cos \alpha \cos \beta - \sin \alpha \sin \beta \\
\cos \alpha \sin \beta + \sin \alpha \cos \beta
\end{bmatrix} \\
&= \begin{bmatrix}
\cos \alpha + \beta \\
\sin \alpha + \beta
\end{bmatrix}.
\end{align*}
</display-math>

We thus conclude that the rotation matrix $M(\beta)$ will indeed rotate a vector by an angle $\beta$.
</proof>

<p>
Our idea of rotating a vector of angle 0 to obtain a vector with angle $\theta$ can be written as
<display-math>
\vec{v}(\theta) = M(\theta)\vec{v}(0).
</display-math>
This does pose a problem: we wish to find the sine and cosine of an angle $\theta$, but in order to do that we first need to know the sine and cosine in order to construct the rotation matrix $M(\theta)$! 
</p>

We thus come to a second problem: how can we obtain rotation matrices, without knowing the exact sine and cosine of the input angle $\theta$? Additionally, we need to find a way to do this efficiently, since multiplication can be computationally intensive.

### Finding the rotation matrices

We will solve the problem of finding the rotation matrix by approximating the angle $\theta$ as a sum of angles $\gamma_i$ with signs $\sigma_i \in \\{ -1, 1 \\}$, such that 

<display-math>
\theta \approx \sum_{i=0}^{n-1} \sigma_i \gamma_i.
</display-math>

Note that we can apply Givens rotation matrices multiple times one after another such that $M\left(\sum_{i=0}^{n-1} \sigma_i \gamma_i \right)=\prod_{i=0}^{n-1} M(\sigma_i \gamma_i)$. If we apply the rotation matrix for each angle $\sigma_i \gamma_i$, the formula of the CORDIC algorithm then becomes

<display-math>
\begin{align*}
&\vec{v}(\theta) = M(\theta)\vec{v}(0) \\
&\approx M(\sigma_n \gamma_n + \dots + \gamma_1 \sigma_1)\vec{v}(0) \\
&= M(\sigma_n \gamma_n) \dots M(\sigma_1 \gamma_1) \vec{v}(0).
\end{align*}
</display-math>

<p>
In what follows we will consider the CORDIC algorithm as an iterative algorithm with $n$ iterations $i \in \{0, \dots, n-1 \}$. The algorithm starts with an initial vector $\vec{v}_{0}$, and at each $i$-th iteration it will take a vector $\vec{v}_{i}$ and produce a new vector $\vec{v}_{i+1}$, such that 

<display-math>
\begin{align*}
\vec{v}_0 &= \begin{bmatrix}
1 \\
0 
\end{bmatrix},\\
\vec{v}_{i+1} &= M(\sigma_i \gamma_i) \vec{v}_{i} \\
&= M\left(\sum_{j=0}^i \sigma_j \gamma_j \right) \vec{v}_{0} \\
&= \prod_{j=0}^i M\left(\sigma_j \gamma_j \right) \vec{v}_{0}.
\end{align*}
</display-math>
</p>

In order to further solve our problem of finding each rotation matrix $M(\sigma_i \gamma_i)$ we will simplify the rotation matrix. Consider the Givens rotation matrix for angle $\sigma_i \gamma_i$:

<display-math>
M(\sigma_i \gamma_i) = \begin{bmatrix}
\cos(\sigma_i \gamma_i) & -\sin(\sigma_i  \gamma_i) \\
\sin(\sigma_i \gamma_i) & \cos(\sigma_i \gamma_i)
\end{bmatrix}.
</display-math>

Since $\cos \gamma_i = \cos -\gamma_i$ we remove the $\sigma_i$ and factor out the cosine. Since $\sin -\gamma = -\sin \gamma$, we have $\sin \sigma_i \gamma_i = \sigma_i \sin \gamma_i$, such that


<display-math>
M(\sigma_i \gamma_i) = \cos(\gamma_i) \begin{bmatrix}
1 & -\sigma_i \tan(\gamma_i) \\
\sigma_i \tan(\gamma_i) & 1
\end{bmatrix}.
</display-math>

Next, we fix the angles $\gamma_i$ to be the same for any input angle $\theta$. This way the values $\tan \gamma_i$ do not depend on the input, and therefore can be computed beforehand. 


Since multiplying and dividing by 2 can be easily implemented using shifts, we choose $\gamma_i = \arctan 2^{-i}$. Note that this is also mathematically correct, and allows us to approximate any angle $\theta$ with arbitrary precision. The full proof for this can be found below. The resulting matrix is 

<display-math>
M(\sigma_i \gamma_i) = \cos(\arctan 2^{-i}) \begin{bmatrix}
1 & -\sigma_i 2^{-i} \\
\sigma_i 2^{-i} & 1
\end{bmatrix}.
</display-math>

Finally, we have to choose values of $\sigma_i$, which will decide in which direction the vector $v_{i}$ will be rotated in the $i$-th iteration. For this, we note that the signs must be such that all the angles $\gamma_i$ add up to $\theta$.

<p>To this end, we introduce another variable, $\theta_i$, initialised as $\theta_0 = \theta$. This variable is updated using the formula $\theta_{i+1} = \theta_{i} - \sigma_i \arctan 2^{-i}$. At each iteration $i$, the value $\theta_i$ tells us how much of the angle $\theta$ there is "left to do" such that
<display-math>
\theta_i = \theta - \sum_{j=0}^{i-1} \sigma_j \arctan 2^{-j}.
</display-math>
</p>

<p>
Since our goal is to reduce the remaining angle to zero, the sign $\sigma_i$ can be computed as 
<display-math>
\begin{equation}
\sigma_i = 
\begin{cases}
    1 & \text{if }~~ \theta_i \geq 0 \\
    -1 & \text{otherwise.}
\end{cases}
\end{equation}
</display-math>
</p>

### Using shifts in fixed-point

If we use a fixed-point representation in binary, we can replace the multiplication by $2^{-i}$ with a right shift and replace the factors $\sigma_i$ with an `if`-statement. We get the following pseudocode:

```
x[0]     = 1
y[0]     = 0
theta[0] = angle
for i in [0, ..., n-1]:
    if theta[i] >= 0:
        x[i+1]     = x[i]     - (y[i] >> i)
        y[i+1]     = y[i]     + (x[i] >> i)
        theta[i+1] = theta[i] - arctan(2 >> i)
    else:
        x[i+1]     = x[i]     + (y[i] >> i)
        y[i+1]     = y[i]     - (x[i] >> i)
        theta[i+1] = theta[i] + arctan(2 >> i)
```

Note that the arctan values would need to be computed beforehand, which is possible since they only need to be known for powers of two and therefore do not depend on the input.

### Correcting for the missing cosines

<p>If we use the pseudocode above, then the final values, $x_n$ and $y_n$, still need to be corrected afterwards. This is because the above pseudocode only applies the matrix
<display-math>
\begin{bmatrix}
1 & -\sigma_i \tan(\gamma_i) \\
\sigma_i \tan(\gamma_i) & 1
\end{bmatrix} = \frac{1}{\cos(\sigma_i \gamma_i)} \begin{bmatrix}
\cos(\sigma_i \gamma_i) & -\sin(\sigma_i  \gamma_i) \\
\sin(\sigma_i \gamma_i) & \cos(\sigma_i \gamma_i)
\end{bmatrix}.
</display-math>
</p>

<p>After $n$ iterations we then obtain
<display-math>
\begin{align*}
\begin{bmatrix}
x_n\\
y_n
\end{bmatrix} &= \prod_{i=0}^{n-1} \begin{bmatrix}
1 & -\sigma_i \tan(\gamma_i) \\
\sigma_i \tan(\gamma_i) & 1
\end{bmatrix} \begin{bmatrix}
1\\
0
\end{bmatrix} \\
&= \prod_{i=0}^{n-1} \frac{1}{\cos(\sigma_i \gamma_i)} \begin{bmatrix}
\cos(\sigma_i \gamma_i) & -\sin(\sigma_i  \gamma_i) \\
\sin(\sigma_i \gamma_i) & \cos(\sigma_i \gamma_i)
\end{bmatrix} \begin{bmatrix}
1\\
0
\end{bmatrix} \\
&= \frac{1}{K_n} \prod_{i=0}^{n-1} \begin{bmatrix}
\cos(\sigma_i \gamma_i) & -\sin(\sigma_i  \gamma_i) \\
\sin(\sigma_i \gamma_i) & \cos(\sigma_i \gamma_i)
\end{bmatrix} \begin{bmatrix}
1\\
0
\end{bmatrix},
\end{align*}
</display-math>
with $K_n = \prod_{i=0}^{n-1} \cos(\gamma_i)$.
</p>

There are two ways to correct for this:
- multiply $x_n$ and $y_n$ with $K_n$ afterwards, or
- multiply $x_0$ and $y_0$ with $K_n$ beforehand.

<p>
These two ways of applying this correction are mathematically equivalent. In this article we will assume we multiply $x_0$ and $y_0$ with $K_n$ beforehand. Our initial vector $v_0$ thus becomes
<display-math>
v_0 = K_n \begin{bmatrix}
1\\
0
\end{bmatrix} = \begin{bmatrix}
K_n\\
0
\end{bmatrix}.
</display-math>
</p>

## Convergence

Given that CORDIC is an iterative algorithm that aims to compute the sine and cosine of an angle, we will need to formally prove that after a certain amount of iterations we actually did obtain the sine and cosine of a given angle.

Let $\theta$ be the angle for which we intend to compute the sine and cosine. Let $n$ be the number of iterations for which we run the CORDIC algorithm. We can formally state the correctness of the CORDIC algorithm as follows:

<theorem envName="Convergence" envId="convergence">
Let $\theta$ be the input angle such that 
\[
\absLength{\theta} \leq \theta_{\mathrm{max}} = \sum_{i=0}^{n-1} \arctan 2^{-i} + \arctan 2^{-(n-1)}.
\]
The CORDIC algorithm will then produce values $x_n$ and $y_n$ such that 
\[
    x_n = \cos(\hat{\theta})\text{ and }y_n = \sin(\hat{\theta}),
\]
and where $\hat{\theta}$ is an angle such that $\absLength{\theta - \hat{\theta}} \leq \arctan 2^{-(n-1)}$.
</theorem>

<!-- <theorem envName="Convergence" envId="convergence">
Let $\theta$ be the input angle such that $\absLength{\theta} \leq \theta_{\mathrm{max}} = \sum_{i=0}^{n-1} \arctan 2^{-i} + \arctan 2^{-(n-1)}$. The CORDIC algorithm will then produce values $x_n$ and $y_n$ such that 
\[
    x_n \cdot K_{n} = \cos(\hat{\theta})\text{ and }y_n \cdot K_{n} = \sin(\hat{\theta}),
\]
such that $K_{n} = \prod_{i=0}^{n-1} \frac{1}{\sqrt{1 + 2^{-2i}}}$ and $\absLength{\theta - \hat{\theta}} \leq \gamma_{n-1}$.
</theorem> -->

What the above theorem says is that by performing $n$ iterations of the CORDIC algorithm, we can compute the sine and cosine of a given angle $\theta$ up to a certain precision if the input angle $\theta$ is below a certain maximum input angle $\theta_{\mathrm{max}} = \sum_{i=0}^{n-1} \arctan 2^{-i} + \arctan 2^{-(n-1)}$. In the figure below it is illustrated how the angles $\gamma_i$ add up to the maximum angle $\theta_{\mathrm{max}}$, and how it is not possible to approximate angles beyond that.

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/convergence.svg">
            <figcaption>Maximum angle $\theta_{\mathrm{max}}$ for $n=40$.</figcaption>
        </figure>
    </div>
</div>

<p>We will prove this theorem using three intermediate results. We will first prove that if we have angles $\gamma_0, \dots, \gamma_{n-1}$ such that $\gamma_i \leq \gamma_{i+1} + \dots + \gamma_{n-1} + \gamma_{n-1}$, and signs $\sigma_0, \dots, \sigma_{n-1}$, then the input angle $\theta$ can indeed be approximated, up to an arbitrarily small error, by a sum of angles.</p>

<p>
Note that we also require that $\absLength{\theta_{i+1}} = \absLength{\absLength{\theta_i} - \gamma_i} = \absLength{\theta_i - \sigma_i \gamma_i}$. This is an important requirement, that is only satisfied if we correctly set the signs such that $\theta_i$ is driven towards zero:
<display-math>
\begin{equation}
\sigma_i = 
\begin{cases}
    1 & \text{if }~~ \theta_i \geq 0 \\
    -1 & \text{otherwise.}
\end{cases}
\end{equation}
</display-math>
</p>

<lemma envName="Driving the angle to 0" envId="angleToZero">
Let $\gamma_0, \dots, \gamma_{n-1}$ be angles that satisfy the condition $\gamma_i \leq \gamma_{i+1} + \dots + \gamma_{n-1} + \gamma_{n-1}$. Let $\theta_0, \theta_1, \dots, \theta_{n-1}$ be any sequence of angles such that $\absLength{\theta_0} \leq \theta_{\mathrm{max}}$ and $\absLength{\theta_{i+1}} = \absLength{\absLength{\theta_{i}} - \gamma_i}$. We then have that
\[
\absLength{\theta_i} \leq \sum_{j=i}^{n-1} \gamma_j + \gamma_{n-1}.
\]
In particular, it is true that $\absLength{\theta_{n}} \leq \gamma_{n-1}$.
</lemma>

<proof>
We provide by induction on $i$.

<p><strong>Base case ($i=0$):</strong> This holds, since the input angle $\theta_0$ is in the domain of convergence.</p>

<p><strong>Induction ($i \to i+1$):</strong></p>

We start with the case for $i$, and apply some of the aforementioned constraints and assumptions to obtain the case for $i+1$.
<display-math>
\begin{align*}
&\absLength{\theta_i} \leq \sum_{j=i}^{n-1} \gamma_j + \gamma_{n-1} \\
&\iff \absLength{\theta_i} - \gamma_i \leq \sum_{j=i}^{n-1} \gamma_j + \gamma_{n-1} - \gamma_i \\
&\iff \absLength{\theta_i} - \gamma_i \leq \sum_{j=i+1}^{n-1} \gamma_j + \gamma_{n-1} \\
&\iff -\gamma_i \leq \absLength{\theta_i} - \gamma_i \leq \sum_{j=i+1}^{n-1} \gamma_j + \gamma_{n-1} \\
&\quad\quad\text{Assumption on the angles: $-\left[\gamma_{n-1} + \sum_{j=j+1}^{n-1}  \gamma_j \right]  \leq -\gamma_i$} \\
&\iff - \left[\sum_{j=j+1}^{n-1} \gamma_j + \gamma_{n-1}  \right]  \leq -\gamma_i \leq \absLength{\theta_i} - \gamma_i \leq \sum_{j=i+1}^{n-1} \gamma_j + \gamma_{n-1} \\
&\iff \absLength{\absLength{\theta_i} - \gamma_i} \leq \sum_{j=i+1}^{n-1} \gamma_j + \gamma_{n-1} \\
&\quad\quad\text{Constraint on the signs: $\absLength{\theta_{i+1}} = \absLength{\absLength{\theta_i} - \gamma_i}$} \\
&\iff \absLength{\theta_{i+1}} \leq \sum_{j=i+1}^{n-1} \gamma_j + \gamma_{n-1}.
\end{align*}
</display-math>

Note that also $\absLength{\theta_{n}} \leq \gamma_{n-1}$.
</proof>

Next, we will prove that angles $\gamma_i = \arctan 2^{-i}$ are fit for this purpose.

<lemma envName="Usage of powers of two" envId="powerTwoAngles">
Let $\gamma_0, \dots, \gamma_{n-1}$ be angles with $\gamma_i = \arctan 2^{-i}$. We have 
\[
\gamma_i \leq \gamma_{i+1} + \dots + \gamma_{n-1} + \gamma_{n-1}.
\]
</lemma>

<proof>
<p>
Note that $\frac{\gamma_{i}}{\gamma_{i+1}} = \frac{\arctan 2^i}{\arctan 2^{i+1}} \leq 2$. Therefore, $\gamma_{i+1} \geq 2^{-1} \gamma_i$, and thus $\gamma_{i+K} \geq 2^{-K} \gamma_i$.
</p>

<p>
We start with the right-hand-side of the inequality.
<display-math>
\begin{align*}
&\gamma_{i+1} + \dots + \gamma_{n-1} + \gamma_{n-1} \\
&\quad\quad\text{(Apply  $\gamma_{i+K} \geq 2^{-K} \gamma_i$ for $K=1, \dots, K=n-1-i$)} \\
&\geq 2^{-1}\gamma_i + \dots + 2^{-(n-1-i)} \gamma_i + 2^{-(n-1-i)} \gamma_i \\
&= \gamma_i \left(2^{-1} + \dots + 2^{-(n-1-i)} + 2^{-(n-1-i)}\right) \\
&\quad\quad\text{(Apply $\sum_{i=1}^{k} 2^{-i} + 2^{-k} = 1$ with $k=n-1-i$)} \\
&= \gamma_i \cdot 1 = \gamma_i
\end{align*}
</display-math>
</p>
We thus conclude that the angles $\gamma_i = \arctan 2^{-i}$ satisfy the assumption on the angles.
</proof>

We do not prove here that $\frac{\gamma_{i}}{\gamma_{i+1}} = \frac{\arctan 2^i}{\arctan 2^{i+1}} \leq 2$. The proof is a bit of work, but I think it can be done as follows:
1. Prove that this fraction is an increasing function by proving that the derivative is positive.
2. Prove that the limit of that fraction is exactly 2 for $i \to \infty$. This can be done by first applying L'Hôpital's rule.
The $\arctan$ function is not easy to work with since not many identities exist for it. Its derivate is $\frac{1}{1+x^2}$, which should be easier to handle.

<example>
The trick where we used the identity $\sum_{i=1}^{k} 2^{-i} + 2^{-k} = 1$ can be illustrated using a simple addition of 0.11...11 and 0.00...01, resulting in 1.00...00:
\[ 
\begin{array}{*8c}
     &\scriptstyle 2^0=1    &    &\scriptstyle 2^{-1}  &\scriptstyle 2^{-2}    &\scriptstyle \dots &\scriptstyle 2^{-(k-1)}    &\scriptstyle 2^{-k}\\
     \hline
     &0    &.    &1  &1    &\dots &1    &1\\
    + &0    &.    &0  &0    &\dots &0    &1\\ 
     \hline
    &1    &.    &0  &0    &\dots &0    &0\\ 

\end{array} 
\]
</example>

Finally, we will prove that by repeatedly rotating the initial vector using these angles, we can obtain the sine and cosine of the approximate angle $\hat{\theta}$.


<lemma envName="Resulting sine and cosine values" envId="trigThetaHat">
<p>Let $\hat{\theta} = \sum_{i=0}^{n-1} \sigma_i \gamma_i$. Let $M(\alpha)$ be the Givens rotation matrix for angle $\alpha$ and let
\[
    \vec{v}_0 = \begin{bmatrix}
        1 \\
        0
    \end{bmatrix} = \begin{bmatrix}
        \cos(0) \\
        \sin(0)
    \end{bmatrix}.
\]
</p>

<p>We then have that
\[
    \prod_{i=0}^{n-1} M\left( \sigma_i \gamma_i \right) \vec{v}_0 = M\left(\sum_{i=0}^{n-1} \sigma_i \gamma_i \right) v = M(\hat{\theta}) \vec{v}_0 = \begin{bmatrix}
        \cos(\hat{\theta}) \\
        \sin(\hat{\theta})
    \end{bmatrix}.
\]
</p>
</lemma>

<proof>
From the properties of the Givens rotation matrix we have that $M(\alpha + \beta) = M(\alpha)M(\beta)$ for any angles $\alpha$ and $\beta$. We also have that if we apply a rotation of angle $\hat{\theta}$ to a vector of angle 0, we obtain a vector of angle $\hat{\theta}$.
</proof>

We can now give a full proof of <smart-ref targetId="convergence" targetType="thm"></smart-ref>:

<proof>
<p>From <smart-ref targetId="angleToZero" targetType="lem"></smart-ref> we have that any input angle $\theta$ such that $\absLength{\theta} \leq \theta_{\mathrm{max}} = \sum_{i=0}^{n-1} \gamma_i + \gamma_{n-1}$ can be correctly approximated by an angle $\hat{\theta} = \sum_{i=0}^{n-1} \sigma_i \gamma_i$, with $\absLength{\theta - \hat{\theta}} \leq \gamma_{n-1}$. From <smart-ref targetId="powerTwoAngles" targetType="lem"></smart-ref> we know that the angles $\gamma_i = \arctan 2^{-i}$ are suitable for this.</p>

<p>From  <smart-ref targetId="trigThetaHat" targetType="lem"></smart-ref> we know that repeatedly rotating an initial vector of angle 0 results in a vector whose $x$ and $y$ coordinates are the cosine and sine of $\hat{\theta}$, respectively.</p>

<p>Finally, recall that the CORDIC algorithm applies the matrix
<display-math>
\begin{bmatrix}
1 & -\sigma_i 2^{-i} \\
\sigma_i 2^{-i} & 1
\end{bmatrix} = \frac{1}{\cos(\arctan 2^{-i})} M(\sigma_i \gamma_i).
</display-math>
Therefore, we still have to correct for the missing $\cos(\arctan 2^{-i})$, by setting the initial values as $x_0 = K_n$ and $y_0 = 0$ where
\[
K_{n} = \prod_{i=0}^{n-1} \cos(\arctan 2^{-i}) = \prod_{i=0}^{n-1} \frac{1}{\sqrt{1 + 2^{-2i}}}.
\]
</p>

</proof>

## A note on the literature

The algorithm and proofs from this paper come from three papers. Before reading these, <smart-link linkType="ext" linkId="wiki_cordic">the wikipedia page</smart-link> can be read as an introduction. 

The first and main source is the original CORDIC paper by Jack Volder <smart-cite bibId="volder_paper"></smart-cite>. This paper contains the main ideas behind the CORDIC algorithm, such as the angles and shifts. It also seems to contain the essence of the theory behind the algorithm, but does not contain any theorems.

The second source is a paper by J.S. Walther <smart-cite bibId="walther_paper"></smart-cite> where it is explained that many variants of CORDIC only differ in a single parameter $m$. It contains a theorem and a proof where it is shown how any angle can be approximated by a sum of angles. It seems, however, that the meaning of the $\alpha$ angles in that paper is ambiguous. In some cases those are the angles $\gamma_i$ from this article, but sometimes they refer to angles $\sigma_i \gamma_i$. Care should be taken while reading the paper. Finally, the paper contains a small bug in the proof of the theorem: the strict inequality should be a non-strict one.

A third and final paper by Hu et al. <smart-cite bibId="hu_paper"></smart-cite> was also consulted while reading this paper. This paper fixes the inequality bug in the Walther paper, but does not give a full proof. It also has an additional theorem and proof that give a more complete argument as to why CORDIC converges. It also shows why the $\arctan 2^{-i}$ angles are mathematically correct.

The three papers above differ both in notation as well as content. One should begin by reading the Volder paper to get a good initial idea, followed by the Walther paper to get a more complete view on the CORDIC variants. Once you are thoroughly frustrated by the ambiguities in the notation from the Walther paper, you can continue by reading the Hu et al. paper to get a more consistent notation, as well as some interesting ideas about extending the capabilities of the algorithm.

## Conclusion

In this article we have explored the CORDIC algorithm. We first gave a quick overview where the mechanism of the algorithm was explained. We then showed how this algorithm can be derived from only basic trigonometry and binary arithmetic. Finally, we gave a formal proof of the convergence properties of the algorithm, showing that it can be used to approximate the sine and cosine of a given angle to within an arbitrarily small error.

CORDIC is a good example of why mathematics and computer science are a powerful combination, and why mathematical knowledge can prove very useful when designing efficient algorithms. In this article we combined knowledge of simple trigonometry and linear algebra on one hand, and knowledge of digital circuitry and fixed-point arithmetic on the other hand. The result is a simple but powerful algorithm that can compute a variety of mathematical functions, such as sine and cosine, using only binary addition and bit-shifts.

I plan on writing a complete series on the CORDIC algorithm, including both additional theory as well as implementations. Stay tuned!

## References

<bibliography>
</bibliography>
