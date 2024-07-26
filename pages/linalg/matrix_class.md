---
layout: page
title: Matrix Datastructure in Swift
permalink: /posts/linalg/matrix
exclude: true
---

<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_linalg_matrix_class %}
</div>

<div>
{% include smart_link/load_internal_urls.html %}
</div>

<p>In this tutorial we will be implementing a matrix data structure in Swift that, as you might guess, represents matrices. Although matrices are two-dimensional, they can also be used to represent one-dimensional vectors (i.e., a vector is a matrix with a single column).</p>

<p>The reason why we will use the Swift programming language is because many of the articles that cover linear algebra in-depth already make use of programming languages such as Python, Julia, MATLAB, etc. Additionally, the Swift language has some interesting features, is statically typed, compiled, and has a brief syntax.</p>

<p>Matrices and vectors are fundamental to linear algebra. Linear algebra data structures, and the algorithms that operate on them, are widely used in computer graphics, machine learning, image and signal processing, physics, and much more. In each of those fields, there is a need for efficient and precise algorithms. A good grasp on the internal workings of linear algebra algorithms can come in handy when working with such algorithms!</p>

<p>In what follows we will go over how matrices are represented in memory, how data structures are implemented in Swift, and how we can write unit tests for the data structures that we have implemented.</p>


## Overview

* TOC 
{:toc}

## Storing matrices in memory

<p>As you might already know, matrices are two-dimensional structures with rows and columns. Below you can see a matrix <inline-math>M</inline-math> with two rows and 3 columns:</p>

<display-math>M = \begin{bmatrix}
1 & -2 & 34\\
46 & 500 & -60
\end{bmatrix}.</display-math>

<p>However, computers store everything in memory sequentially. That is, all data in memory is represented as a single sequence of bytes. As such, we will have to devise a way to store two-dimensional elements in one-dimensional memory. Traditionally, there are two important ways of doing so: row-major and column-major. This is illustrated by the figure below:</p>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rowMajor">
            <img src="/assets/images/linalg/row_major.png">
            <figcaption>Row-major</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="colMajor">
            <img src="/assets/images/linalg/col_major.png">
            <figcaption>Column-major</figcaption>
        </figure>
    </div>
</div>

<p>In the case of row-major (<smart-ref targetType="fig" targetId="rowMajor"></smart-ref>), the elements are stored row per row, by first storing all elements of the first row one after the other, followed by the elements of the second row, then the third, and so on. Column-major (<smart-ref targetType="fig" targetId="colMajor"></smart-ref>) does the exact opposite: the elements are stored in a column-by-column fashion.</p>

<!-- <example-box>
<example-title>Example</example-title>

<p>Consider the matrix <inline-math>M</inline-math> as defined earlier:
<display-math>M = \begin{bmatrix}
1 & -2 & 34\\
46 & 500 & -60
\end{bmatrix}.</display-math>
When stored in memory, the matrix will look like below:</p>

<table>
    <thead><tr>
        <th>Memory Address</th>
        <th>Column-major</th>
        <th>Row-major</th>
    </tr></thead>
    <tbody>
        <tr>
            <td><texttt>base + 0</texttt></td>
            <td> 1   </td>
            <td> 1 </td>
        </tr>
        <tr>
            <td><texttt>base + 1</texttt></td>
            <td> 46  </td>
            <td>-2 </td>
        </tr>
        <tr>
            <td><texttt>base + 2</texttt></td>
            <td> -2  </td>
            <td>34 </td>
        </tr>
        <tr>
            <td><texttt>base + 3</texttt></td>
            <td>500  </td>
            <td>46 </td>
        </tr>
        <tr>
            <td><texttt>base + 4</texttt></td>
            <td> 34  </td>
            <td>500</td>
        </tr>
        <tr>
            <td><texttt>base + 5</texttt></td>
            <td>-60  </td>
            <td>-60</td>
        </tr>
    </tbody>
</table>

<p>In the left column you can see the memory address. The <texttt>base</texttt> refers to the base address of the matrix (i.e., the address of the first element). In the middle you can see the column-major ordering and the row-major ordering on the right.</p>
</example-box> -->

<p>Now that we stored our matrix in memory, we still have to access the elements in the matrix. For this, we need to know where to find each element of the matrix. The <texttt>base</texttt> address is the address where the matrix is stored in the memory. Given an element on row <texttt>r</texttt> and column <texttt>c</texttt>, we wish the know the offset from the base address <texttt>base</texttt> such that the element is located at address <texttt>base + offset</texttt>. Luckily, there are two easy formulas to do this computation:</p>

<ul>
    <li>Row-major: <texttt>offset = r * C + c</texttt></li>
    <li>Column-major: <texttt>offset = c * R + r</texttt></li>
</ul>

<p>Where <texttt>R</texttt> is the total number of rows and <texttt>C</texttt> is the total number of columns. Note that we are using 0-indexed row and column numbers.  We will illustrate the usage of these formulas with the following examples:</p>

<example-box title="Example">

<p>Let us once again consider the following matrix:</p>

<display-math>M = \begin{bmatrix}
1 & -2 & 34\\
46 & 500 & -60
\end{bmatrix}.</display-math>

<p>If we wish to access the element <texttt>-60</texttt> at row <texttt>r=1</texttt> and column <texttt>c=2</texttt>, using row-major or column-major, we'll need to apply the respective formulas:</p>

<ul>
    <li>Row-major: <texttt>offset = r * C + c = 1 * 3 + 2 = 5</texttt>,</li>
    <li>Column-major: <texttt>offset = c * R + r = 2 * 2 + 1 = 5</texttt>.</li>
</ul>

<p>In this case, the row- and column-major indices were the same. Let us now retrieve the element <texttt>46</texttt>. We once again apply the appropriate formulas:</p>

<ul>
    <li>Row-major: <texttt>offset = r * C + c = 1 * 3 + 0 = 3</texttt>,</li>
    <li>Column-major: <texttt>offset = c * R + r = 0 * 2 + 1 = 1</texttt>.</li>
</ul>

<p>In this case the row- and column-major indices turned out to be different.</p>
</example-box>

## Column-major and the legacy of FORTRAN

<p>Now that we have learned how matrices can be stored in memory, we need to choose whether our own matrix will make use of row-major or column-major ordering. When making this choice we need to take into account how we will use our matrix, as well as the libraries that we want to interact with. Note that converting between row-major and column-major might take as much as <inline-math>\mathcal{O}(n^2)</inline-math> operations in the worst case, although there are more efficient tricks to implement such a conversion.</p>

<p>For the necessary context, we first need to go back to 1957 when John Backus invented the FORTRAN language. This language was the first "modern" programming language that was more high-level and user friendly than binary or assembly. Its primary purpose was to simplify the job of programming numerical algorithms in mainframes, which up until then had been mostly done by manually flipping bits. Its main contribution was allowing programmers to specify machine instructions using plain language, using keywords such as <texttt>for</texttt> and <texttt>if</texttt>, as opposed to implementing programs in binary or assembly.</p>

<p><strong>Fun fact:</strong> John Backus is also known for inventing the so-called <smart-link linkType="ext" linkId="wiki_backus_naur">Backus-Naur form</smart-link>, which is a widely used notation to describe context-free grammars.</p>

<p>While designing the FORTRAN language, the team at IBM had to choose how to store matrices in memory, given that matrices are often used in such numerical algorithms. Back then, the choice was made to do this in column-major. The language became widespread soon after, and many libraries where written in FORTRAN, thus making use of column-major. Some of the libraries, such as LAPACK, are still used up until today. If you wish to learn more about the history of FORTRAN, or the history of computer science in general, make sure to listen to the <smart-link linkType="ext" linkId="advent_of_computing">Advent of Computing podcast</smart-link>! The podcast has a <smart-link linkType="ext" linkId="podcast_fortran">dedicated episode</smart-link> on the topic of FORTRAN.</p>

<p>Nowadays, usage of both row-major and column-major are widespread in the field of scientific computing. Row-major, for example, is used in NumPy in Python, as well as OpenCV in C++ (and its Python bindings). Column-major, on the other hand, also has survived into the 21st century and is used by the Eigen C++ library, MATLAB, as well as Apple Accelerate in Swift. In order to provide interoperability with Apple Accelerate, our matrix will also make use of column major.</p>

## Classes and structs

In the Swift language there are two keywords that are important when implementing custom types: <texttt>struct</texttt> and <texttt>class</texttt>. These keywords also appear in C++. Their meanings in Swift are profoundly different, however, with important implications on performance.

On one hand, Swift supports classes. Classes support inheritance and polymorphism. They are also passed by reference, which allows for sharing instances across a program. This flexibility comes at a cost, however, since class objects are stored on the heap and make use of reference counting. Additionally, method calls on classes are resolved by consulting a so-called vtable, through a process called "dynamic dispatch". Concretely this means that when you call a method on a class object, a table with memory addresses is consulted at run-time to determine the location of the appropriate method.

A struct, on the other hand, is a type with value-semantics. In Swift this means that the object is passed by value and thus copied every time it is assigned to a new variable. While this might not sound very efficient, it is actually not that bad since many data structures such as arrays make use of a technique called "copy-on-write" (COW), which reduces the amount of times the underlying data is actually duplicated. As a result, copying a struct is usually just a cheap shallow copy. A benefit is that passing objects as values instead of references prevents bugs that are the result of sharing instances. Additionally, they are stored on the stack, which is more efficient than the heap. 

Another important aspect of structs is that they do not support inheritance. This might sound like a big limitation, but it actually has the benefit that when you call a method on a struct, the compiler knows exactly which method is called at compile time, as opposed to having to resolve this through a vtable at run-time. This concept is called "static dispatch", and allows the compiler to apply various optimisations such as inlining function calls.

As a best practice, you should consider using structs by default. I learned all the stuff above from a <smart-link linkType="ext" linkId="wwdc16_performance">WWDC 2016 talk on Swift performance</smart-link>. If you are interested in how Swift handles objects, memory, polymorphism, etc., I do recommend to watch this talk.



A struct can be defined as follows:

```swift
struct Matrix<ElementType> {
    // ...
}
```

As you can see the syntax is very similar to C++ or Java. The <texttt>ElementType</texttt> indicates that this is a generic struct that takes a type parameter. This type parameter will determine what type of elements our matrix will contain, such as <texttt>Int</texttt>, <texttt>Float</texttt>, etc.

<p><strong>Note:</strong> there are some notable exceptions to the information above. A class can be marked <texttt>final</texttt> in order to allow the compiler to make extra optimisations at run-time. A struct, on the other hand, can be referenced through one of the protocols it implements. In that case, the struct is stored in a wrapper, which might be less efficient.</p>

## Properties

In Swift, classes and structs can have data members. In Swift lingo these are called "properties". In the case of our matrix struct, we'll need to store the elements that make up the matrix, as well as the number of rows and columns.

```swift
struct Matrix<ElementType> {
    public private(set) var elements: [ElementType]

    public private(set) var nRows: Int
    public private(set) var nCols: Int

    // ...
}
```

The elements of the matrix will be stored in a single one dimensional array <texttt>elements</texttt>. The <texttt>nRows</texttt> and <texttt>nCols</texttt> properties indicate the number of rows and columns, respectively. The <texttt>public</texttt> modifier indicates that their getters are public while the <texttt>private(set)</texttt> means their setters are private. This is important, since modifying the <texttt>nRows</texttt> or <texttt>nCols</texttt> properties would cause them to no longer match the number of elements in the matrix. We also do not want users to freely modify the contents of the matrix. Instead, they should make use of the setters exposed by the public interface of our matrix.

## Initialisers

In order to implement any kind of data structure, we will need constructors. In Swift constructors are called "initialisers". Such an initialiser will be called whenever a struct is instantiated in Swift, and can thus be used to prepare an object before it is used. An initialiser is declared with the <texttt>init()</texttt> signature, and multiple parameters or even none at all. For the matrix we will make use of the following initialisers:

```swift
struct Matrix<ElementType> {
    // ...

    /// Create a Matrix that is a column vector.
    init(columnVector: [ElementType]) {}

    /// Create a Matrix from an array of rows.
    init(rows: [[ElementType]]) {}

    /// Create a Matrix from an array of columns.
    init(columns: [[ElementType]]) {}

    /// Construct a Matrix given a number of columns and elements in column-major order.
    init(elementsColMajor: [ElementType], numCols: Int) {}

    /// Construct a Matrix given a number of rows from elements in row-major order.
    init(elementsRowMajor: [ElementType], numRows: Int) {}

    // ...
}
```

As you might note, there is no copy-constructor defined as we might expect in C++. As a result of the so-called value semantics of structs, every time you assign as struct to a new variable or pass it to a function, a copy will be created. Therefore a copy constructor will not be needed. Do note that since we store our elements in an array, and since arrays implement the copy-on-write idiom, copying our matrix is not as expensive as it may sound.

The implementation of most of these initialisers is trivial, and is left as an exercise to the reader. The <texttt>init(elementsRowMajor: [ElementType], numRows: Int)</texttt> can be implemented by first computing the row-major index in order to retrieve each element, and then storing the elements one by one in column-major ordering. The full implementation can be seen below:

```swift
struct Matrix<ElementType> {
    // ...

    /// Convert row and col number to row-major index
    private func rowColToRowMajorIdx(row: Int, col: Int) -> Int {
        precondition(row >= 0 && row < self.nRows)
        precondition(col >= 0 && col < self.nCols)

        return row * self.nCols + col
    }

    /// Construct a Matrix given a number of rows from elements in row-major order.
    init(elementsRowMajor: [ElementType], numRows: Int) {
        // make sure that the number of elements matches the number of rows
        // each row should have equal length.
        precondition(elementsRowMajor.count % numRows == 0)

        self.elements = []
        
        // we pre-allocate a certain amount of space in the array
        self.elements.reserveCapacity(elementsRowMajor.count)

        self.nRows = numRows
        self.nCols = elementsRowMajor.count / numRows

        // note that we first iterate over columns and then rows. 
        // This way, we fill the array of elements in col-major order
        for col in 0..<self.nCols {
            for row in 0..<self.nRows {
                // compute the index
                let rowMajorIdx = rowColToRowMajorIdx(row: row, col: col) 
                
                // retrieve element
                let elem = elementsRowMajor[rowMajorIdx] 

                // append to the elements
                self.elements.append(elem) 
            }
        }
    }

    // ...
}
```

The function <texttt>rowColToRowMajorIdx</texttt> takes the row and column number of an element, and then computes the row-major index of that element. This is necessary since the elements are given in row-major order. The <texttt>precondition</texttt> can be used to assert conditions that always need to be true. If the boolean passed to <texttt>precondition</texttt> is false the program will terminate. In this case, we check that the row and column numbers are valid and not out of bounds.

The initialiser below once again begins with a precondition to make sure that the number of provided elements matches the number of rows, such that all rows have an equal number of elements. Next, the array of elements <texttt>self.elements</texttt> is initialised to an empty array. The required amount of space is also reserved beforehand. We do this in order to prevent the array from being re-sized later on, which could be costly. 

Once the array is initialised, and the provided elements are good and well, we can start filling <texttt>self.elements</texttt>. Note that we first iterate over the columns and then over the rows, in order to enforce the column-major ordering of <texttt>self.elements</texttt>. At each iteration the element <texttt>(row, col)</texttt> is retrieved from <texttt>elementsRowMajor</texttt> using its row-major index, and appended to <texttt>self.elements</texttt>.

## Getters and setters

Another crucial part of any data structure are the getters and setters. For this, we will implement the subscript operator which allows us to access individual elements by specifying their row and column numbers between brackets. It can be used as follows:

```swift
let element = matrix[5, 3] // access element at row nr 5 and column nr 3.
matrix[6, 2] = -65.659  // modify element at row nr 6 and column nr 2.
```

In general, the subscript operator in Swift can be implement as follows:

```swift
struct SomeStructType {
    public subscript(param: ParamType, anotherParam: SecondParamType /* ... */) -> ReturnType {
        get {
            // prepare some value to return ...
            return someValue;
        }
        set (newValue) {
            // do something with `newValue` to modify the state of the object
        }
    }
}
```

As can be seen above, the subscript operator makes it possible to both implement a getter as well as a setter. The programmer can freely choose the type and amount of parameters that are passed to the subscript operator. In the case of our matrix struct, the operator will take row and column numbers as integers:

```swift
struct Matrix<ElementType> {
    // ...

    /// Convert row and col number to column-major index
    private func rowColToColMajorIdx(row: Int, col: Int) -> Int {
        precondition(row >= 0 && row < self.nRows)
        precondition(col >= 0 && col < self.nCols)

        return col * self.nRows + row
    }

    /// Get/set the element at the specified row and column.
    public subscript(row: Int, col: Int) -> ElementType {
        get {
            precondition(row >= 0 && row < self.nRows)
            precondition(col >= 0 && col < self.nCols)
            let idx = rowColToColMajorIdx(row: row, col: col)

            return self.elements[idx]
        }
        set(newValue) {
            precondition(row >= 0 && row < self.nRows)
            precondition(col >= 0 && col < self.nCols)
            let idx = rowColToColMajorIdx(row: row, col: col)

            self.elements[idx] = newValue
        }
    }

    // ...
}
```

The getter and setters both have pre-conditions to make sure that the row and column numbers are valid and not out of bounds. The appropriate column-major index is then computed using <texttt>rowColToColMajorIdx</texttt>, since all elements of the matrix are stored in a single array. In the case of the getter, the element at that index is returned. In the case of the setter, the new value is assigned to that index.

## Printing

Aside from retrieving and setting the data contained in the matrix, we wish to have a user-friendly representation of the matrix. In this section we will do this in two ways. First, we will provide a representation that is compatible with <texttt>print()</texttt> and is very similar to ASCII-art. Second, we will provide a way to print to LaTeX format, such that it can be rendered to PDF.

### Using print statements

 In Swift it is possible to print to the console using the <texttt>print()</texttt> function:

```swift
print("Hello world!")
```

When debugging, or when presenting information to the user, it can be useful to have textual String representations of various objects. In case we wish to display objects other than string, we can embed them using the <texttt>\()</texttt> operator. This is called "string interpolation". Example:
```swift
let x = 1.23
let arr = [1,2,3]
print("Some array \(arr) and a float \(x)")
```

This results in 

```
Some array [1, 2, 3] and a float 1.23
```

Since we also want to be able to print out the contents of our matrix, we will have to implement the <texttt>CustomStringConvertible</texttt> protocol, which provides a <texttt>description</texttt> property. When we pass our object to the string interpolation parameter, this will automatically call the <texttt>description</texttt> property. This can be done by extending our matrix struct:

```swift
extension Matrix: CustomStringConvertible where ElementType: CustomStringConvertible {

    /// Called by the \() operator.
    var description: String {
        // ... string conversion code goes here
    }
}
```

The <texttt>extension</texttt> keyword indicates that we are extending the matrix struct with extra functionality, namely the functionality provided by <texttt>CustomStringConvertible</texttt>. The <texttt>where</texttt> clause indicates that this extension will only be available to matrices whose elements are of an <texttt>ElementType</texttt> that has, in turn, also implemented <texttt>CustomStringConvertible</texttt>. A possible implementation can be as follows:

```swift
extension Matrix: CustomStringConvertible where ElementType: CustomStringConvertible {
    var description: String {
        var stringRepresentation = ""

        for row in 0..<self.nRows {
            var rowContents = ""

            // concatenate all elements of the row
            for col in 0..<self.nCols {
                rowContents += "\(self[row, col]) "
            }

            // merge the different rows using newlines
            stringRepresentation += rowContents + "\n"
        }

        return stringRepresentation
    }
}
```

This will first go row by row and merge all elements of a row into one string <texttt>rowContents</texttt>. Once all elements are concatenated, the result is concatenated with the string <texttt>stringRepresentation</texttt> that already contains the preceding rows. Note that the string representation of individual elements is obtained by applying the string interpolation operator, which is possible since the elements are required to provide <texttt>CustomStringConvertible</texttt> according to the <texttt>where</texttt> clause. We can try out our new string representation by creating a matrix, and passing it to <texttt>print</texttt>:


```swift
let mat = Matrix<Float>(rows: [
    [1, 2, 3],
    [4, 2464, 6],
    [7, 8, 9]
])

print("Matrix:\n\(mat)")
```

As can be seen below, the full contents of the matrix are converted to text format and outputted to the console:

```
Matrix:
1.0 2.0 3.0 
4.0 2464.0 6.0 
7.0 8.0 9.0 
```

The implementation above is a bit primitive and mainly serves as a demonstration. In the code in the GitHub repository, I have implemented a more advanced version that has evenly spaced columns, as well as brackets around the matrix. The result looks as follows:

```
Matrix:
+-                -+
| 1.0  2.0     3.0 |
| 4.0  2464.0  6.0 |
| 7.0  8.0     9.0 |
+-                -+
```

### Printing in LaTeX format

LaTeX is a typesetting language that can be used to write documents. A document in LaTeX format can be rendered as a PDF. LaTeX is widespread within the academic community, although most notably in maths, physics, computer science, as well as engineering. The typesetting language therefore has extensive facilities for typesetting formulas, diagrams, graphs, and other means of conveying technical concepts. 

For ease of use, we can implement a method for our struct that automatically represents the contents of the matrix in LaTeX format, making use of the <texttt>bmatrix</texttt> environment for typesetting matrices. The full implementation is as follows:

```swift
func toLaTeX() -> String {
    // we store the full LaTeX representation in 'latexRepresentation'
    // we begin the matrix by opening the bmatrix environment
    var latexRepresentation = "\\begin{bmatrix}\n"
    
    // since latex is written from left to right and top to bottom, 
    //  we iterate in row-major order.
    for row in 0..<self.nRows {
        // we first convert each element into a string representation
        var rowElements: [String] = []
        for col in 0..<self.nCols {
            let elem = self[row, col]

            // convert element to string
            rowElements.append("\(elem)")
        }
        // merge all elements in the row, separated by "&" and followed by a double slash
        let rowRepresentation = rowElements.joined(separator: " & ") + "\\\\" 

        // add the row to the rest of the matrix
        latexRepresentation += rowRepresentation + "\n"
    }

    // close the bmatrix environment
    latexRepresentation += "\\end{bmatrix}\n"

    return latexRepresentation
}
```

In the above example we have used a method <texttt>joined</texttt> that can be applied to an array. This method is very useful if we wish to merge the elements of an array into a single string. The different elements will be concatenated with the "separator" in between every pair of elements. In the following example we can use this method to merge an array of numbers:

```swift
let arr = [1, -8, 98]
let stringConcat = arr.joined(separator: " ~ ")
print(stringConcat)
```

This will produce the following output, where we can see the numbers separated by '~':

```
1 ~ -8 ~ 98
```

Now that our implementation is finished, we can obtain the LaTeX representation of our matrix, by invoking the <texttt>toLaTeX()</texttt> method:

```swift
let mat = Matrix<Float>(rows: [
    [1, 2, 3],
    [4, 2464, 6],
    [7, 8, 9]
])

print(mat.toLaTeX())
```

This will produce the following result in the terminal:

```latex
\begin{bmatrix}
1.0 & 2.0 & 3.0\\
4.0 & 2464.0 & 6.0\\
7.0 & 8.0 & 9.0\\
\end{bmatrix}
```

If we render this with LaTeX, we get the full contents of the matrix in a nice and clean format:

<display-math>\begin{bmatrix}
1.0 & 2.0 & 3.0\\
4.0 & 2464.0 & 6.0\\
7.0 & 8.0 & 9.0\\
\end{bmatrix}</display-math>

## Tests

Now that we have implemented all the functionality of our matrix, it is time to verify that our matrix actually works. The first test we will write covers the initialiser that takes an array of elements in row-major ordering.

```swift
final class MatrixInitTests: XCTestCase {
    // ...

    /// Test to verify that a matrix can be constructor from an array of elements
    /// in row-major order.
    public func testInit1DArrayRowMajor() {
        let mat = Matrix<Int>(elementsRowMajor: [
            1,2,3,
            4,5,6,
            7,8,9,
            10,11,12
        ], numRows: 4)

        XCTAssertEqual(mat.nRows, 4)
        XCTAssertEqual(mat.nCols, 3)

        XCTAssertEqual(mat.elements[0], 1)
        XCTAssertEqual(mat.elements[1], 4)
        XCTAssertEqual(mat.elements[2], 7)
        XCTAssertEqual(mat.elements[3], 10)
        XCTAssertEqual(mat.elements[4], 2)
        XCTAssertEqual(mat.elements[5], 5)
        XCTAssertEqual(mat.elements[6], 8)
        XCTAssertEqual(mat.elements[7], 11)
        XCTAssertEqual(mat.elements[8], 3)
        XCTAssertEqual(mat.elements[9], 6)
        XCTAssertEqual(mat.elements[10], 9)
        XCTAssertEqual(mat.elements[11], 12)
    }

    // ...
}
```

In the <smart-link linkType="int" linkId="swift_package_manager">previous tutorial on Swift</smart-link>, we saw that we can declare a set of test cases using <texttt>XCTestCase</texttt>. Checking whether certain values are correct can be done using <texttt>XCTAssertEqual</texttt>. In the above test we call the initialiser we want to test, in order to construct our matrix. We then assert that the number of rows and columns needs to be correct. Finally, we verify the contents of the matrix. Note that while the initialiser takes an array of elements in row-major ordering, the <texttt>elements</texttt> property gives us an array of elements in column-major order, since that is the order that the Matrix struct uses internally.

Next, we will test our implementation of the <texttt>CustomStringConvertible</texttt> protocol. For this we again construct a matrix, and then invoke this protocol using either the string interpolation operator in combination with <texttt>print()</texttt>, or we can call the <texttt>description</texttt> property directly.

```swift
final class MatrixPrettyPrintTests: XCTestCase {
    // ...

    /// Test to verify that the matrix can be correctly converted using a string
    /// using either the string interpolation operator, or the description property.
    public func testPrettyPrint4x3() {
        let mat = Matrix<Int>(rows: [
            [2, 3, 5],
            [3, 65, 32],
            [-6, -6989, 0],
            [-68, 1, 1]
        ])

        let expected = """
        +-              -+
        | 2    3      5  |
        | 3    65     32 |
        | -6   -6989  0  |
        | -68  1      1  |
        +-              -+
        """

        XCTAssertEqual(mat.description, expected)
        XCTAssertEqual("\(mat)", expected)
    }

    // ...
}
```

Note that in the above test case, we test my refined implementation of <texttt>CustomStringConvertible</texttt> that can be found on GitHub, and not the simple implementation we discussed <smart-link linkType="local" linkId="using-print-statements">earlier</smart-link> in the article.

## Conclusion

In this article we have discussed how to implement a matrix data structure in Swift. We went over the different methods of storing matrices in memory and the trade-offs that have to be made. We discussed classes and structs in Swift, their differences, as well as why we chose struct. After discussing the theory, we practically implemented our matrix, by providing initialisers, getters and setters, and printing utilities. Finally, we wrote unit tests to verify that our matrix works as intended.

By now you should have a basic idea of how to implement data structures in Swift, and how to make use of Swift to implement a matrix data structure. Note that this is a very simple implementation, where we use a dense representation of a two-dimensional matrix. There are, however, different types of matrices for which there exist more specialised and efficient implementations. Some examples:
- [sparse matrices](https://en.wikipedia.org/wiki/Sparse_matrix#Storage)
- [tridiagonal matrices](https://en.wikipedia.org/wiki/Tridiagonal_matrix#Computer_programming)
- [symmetric matrices](https://en.wikipedia.org/wiki/Symmetric_matrix)
- triangular matrices
- [n-dimensional tensors](https://en.wikipedia.org/wiki/Tensor_(machine_learning))

Useful links:
- <smart-link linkType="ext" linkId="code_linalg">The code used in this tutorial</smart-link>
- <smart-link linkType="int" linkId="swift_package_manager">Earlier tutorial on the Swift Package Manager</smart-link>
- <smart-link linkType="ext" linkId="wwdc16_performance">The WWDC16 talk on Swift performance</smart-link>
- <smart-link linkType="ext" linkId="podcast_fortran">The Advent of Computing episode on FORTRAN</smart-link>

In the next tutorials we will be considering a number of algorithms from numerical linear algebra and how to implement them. Stay tuned!


