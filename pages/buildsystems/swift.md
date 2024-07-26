---
layout: page
title: Swift Package Manager
permalink: /posts/buildsystems/swift
exclude: true
referenceId: swift_package_manager
---


Swift is a statically typed and compiled programming language created by Apple in 2014, thereby drawing experience from existing programming languages such as Python, Rust, and C++. As you can see from the code below, the syntax looks very much like Python. However, as noted earlier, it also has the benefit of being as statically typed and compiled language.

```swift
import Foundation

public func computeSum(numbers: [Int]) -> Int {
    var total = 0
    for number in numbers {
        total += number
    }
    return total
}

var numberList = [1, 382, -894]
let information: [String: Any] = [
    "numbers": numberList,
    "sum": computeSum(numbers: numberList)
]
```

In this post we will learn how to create a new Swift project from scratch, including an executable and unit tests. In order to do this we will make use of the following tools:

**Note** that we do not make use of XCode. While opinions on which IDE to use can differ from person to person, I do strongly recommend that you learn how to compile and run code from the **command line**. Once you have a good grip on the language and the associated tooling, you can move on to use an IDE that nicely abstracts away all the technical details behind a GUI, such as XCode or VSCode. The reason for this is that IDEs sometimes have bugs, or that errors might occur. In such a scenario it is very useful to have a good idea of what goes on behind the scenes.
## Prerequisites

In this post we will not go over the installation progress. How to install Swift on different platforms can be found in the <smart-link linkType="ext" linkId="swift_docs">official documentation</smart-link>. To check whether Swift is installed on MacOS, you can run the following command:

```
swift --version
```

It is also assumed that you already have some programming experience in another language, such a Python, Java, or C++. Advanced knowledge of build systems is not needed.
## Creating a project

For managing the project, its targets, and the dependencies, we will make use of the Swift Package Manager (SwiftPM). In this tutorial we will be building a command line tool. Such a project can be created with the following command:

```
swift package init --name <name> --type executable
```

If we run the command with "NewProject" as the project name, we get the following files:
```
.
+-- Sources
|   +-- main.swift
+-- Package.swift
```

The `Sources` directory is where you place your source files. In the Swift language source files end with the `.swift` extension. The  `Package.swift` file contains information about the project, the targets, the dependencies, etc. In the `main.swift` file a small "Hello world" example has already been provided. 

The file `Package.swift` has the following contents:
```swift
let package = Package(
    name: "NewProject",
    targets: [
        // run with `swift run`
        .executableTarget(name: "NewProject"),
    ])
```

The `executableTarget` indicates that this project can be run as an executable. We can run the program using the `swift run` command. This results in the following output:
```
Hello, world!
```
## Adding a dependency

Since the current "hello world" example is quite boring, we can make it more interesting by adding some libraries to the project. Concretely, we will make use of the <smart-link linkType="ext" linkId="rainbow_lib">Rainbow</smart-link> library that makes it easy to print coloured text to the terminal.

We can add dependencies by modifying the `Package.swift` file. The `Package` object has a `dependencies` argument where dependencies can be specified. Similarly, the `executableTarget` also takes a `dependencies` argument, with which you can specify the package (`package`) as well as the module (`name`) you wish to use in your code:

```swift
let package = Package(
    name: "NewProject",
    dependencies: [
        // used for printing colored text to the terminal
        .package(url: "https://github.com/onevcat/Rainbow", 
                 branch: "master")
    ],
    targets: [
        // run with `swift run`
        .executableTarget(
            name: "NewProject"
            dependencies: [
                .product(name: "Rainbow", package: "Rainbow")
            ],
            path: "Sources")
    ])
```

As we can see from the call to `.package`, it is possible to specify a GitHub link as the repository for a package. SwiftPM can then download the library directly from the GitHub repo and incorporate it in the build process.

We can now go ahead, and use the library in our program:
```swift
import Foundation
import Rainbow

// rainbow example
print("Hello world!".red)
print("Hello world!".bit8(172)) // orange
print("Hello world!".yellow)
print("Hello world!".green)
print("Hello world!".cyan)
print("Hello world!".blue)
print("Hello world!".bit8(13)) // purple
```
If we run the `swift run` command, we get the following output:

<div class="mono-box">
<p style="font-family:'Lucida Console', monospace">
Building for debugging...<br>
[7/7] Applying NewProject<br>
Build complete! (0.67s)<br>
<span style="color:red">Hello world!</span><br>
<span style="color:orange">Hello world!</span><br>
<span style="color:yellow">Hello world!</span><br>
<span style="color:green">Hello world!</span><br>
<span style="color:cyan">Hello world!</span><br>
<span style="color:blue">Hello world!</span><br>
<span style="color:purple">Hello world!</span><br>
</p>
</div>

## Adding tests

The Swift Package Manager allows us to easily add unit tests. Before we can test anything, we should add some more code. Let us create a file `Multiplication.swift` in the `Sources` directory. In this file we will add a function `multiplyByTwo` that takes an integer, and multiplies it by two:
```swift
/// Function to multiply a number by two.
///
/// - Parameter x: the number that will be multiplied by two.
/// - Returns: a number that is two times x.
public func multiplyByTwo(x: Int) -> Int {
    return x * 2
}
```

Next, we will set up the testing environment by adding a testing target to `Package.swift`, adding a `Tests` directory and a `MultiplicationTests.swift` file inside that directory. This results in the following file structure:

```
.
+-- Sources
|   +-- main.swift
|   +-- Multiplication.swift
+-- Tests
|   +-- MultiplicationTests.swift
+-- Package.swift
```

Adding a test target to  `Package.swift` is similar to specifying the `executableTarget`:
```swift
    targets: [
        // run with `swift run`
        .executableTarget(
            name: "NewProject"
            dependencies: [
                .product(name: "Rainbow", package: "Rainbow")
            ],
            path: "Sources"),
        // run with `swift test`
        .testTarget(
            name: "NewProjectTests",
            dependencies: ["NewProject"],
            path: "Tests")
    ]
```

Now that we have set up the correct environment, we can start writing some unit tests in the `MultiplicationTests.swift` file, making use of the `XCTest` framework. We first have to import our package `NewProject` with the `@testable` attribute. Note that the `@testable` attribute is very important, otherwise `XCTest` may not be able to access your code!

```swift
import Foundation
import XCTest

// This import statement annotated with @testable, gives XCTest access to all
// the code in 'NewProject'
@testable import NewProject

final class MultiplicationTests: XCTestCase {
    /// Test to verify that positive inputs work properly.
    func someTestMethod() {
        XCTAssertEqual(multiplyByTwo(x: 4), 8)
        XCTAssertEqual(multiplyByTwo(x: 10), 20)
    }

    /// Test to verify that negative inputs work properly.
    func negativeNumbersTest() {
        XCTAssertEqual(multiplyByTwo(x: -5), -10)
    }
}
```

In the code above you can see two methods, that contain three asserts in total. The `XCTAssertEqual` function will require that two values are exactly equal to each other. If they are not equal then `XCTAssertEqual` will report a failure. A method can have one or more asserts. 

We can execute our newly created unit tests by invoking the `swift test` command. In the output we can clearly see that all tests succeeded:

```
Executed 2 tests, with 0 failures (0 unexpected) in 0.002 (0.003) seconds
```

If we modify our function `multiplyByTwo` by having it return `x * 3`, and re-run the tests, we can see that the tests failed:

```
Executed 2 tests, with 3 failures (0 unexpected) in 0.162 (0.163) seconds
```

As a result, adding unit tests makes it very easy to find bugs in your code. This can help you with debugging while programming (i.e., test-driven development) but it can also help you to find bugs later on while you are modifying or refactoring code (i.e., regression testing).

## Conclusion

In this post we discovered how to create projects with the Swift package manager and how to add targets as well as dependencies. We also added a small and colourful "hello world" example, and wrote a few unit tests.

A GitHub repository with the code can be found <smart-link linkType="ext" linkId="code_buildsystem_swift">here</smart-link>. In order to learn more about the Swift language I recommend writing programs in Swift, while at the same time consulting various resources:
* [Google's Swift Style Guide](https://google.github.io/swift/)
* [Swift book](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
* Stack overflow

However, aside from writing code and learning how to use language constructs, it is also very important to learn about the tooling that is used for programming in Swift: the Swift Package Manager, how to customise the build process, how to export your code as a library, the compiler, using an IDE, etc.
