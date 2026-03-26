---
layout: page
title: C++ projects with CMake
permalink: /posts/buildsystems/cpp_cmake
exclude: true
referenceId: cpp_cmake
---

<div>
{% include enable_image_zoom.html %}
</div>

<div>
{% include enable_title_numbering.html %}
</div>

<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_buildsystems_cpp %}
</div>

## Introduction

The C++ programming language is one of the most widely used programming languages. Applications range from operating systems to quantitative finance and video game engines. CMake is a tool that allows us to manage the build infrastructure of a C++ project. This build system then allows us to take C++ code and turn it into an executable that we can run on a computer.

In this tutorial we will discover how to set up a basic project using CMake. To do this, we will create a small project that enables us to perform basic arithmetic on vectors. Such a small code base then allows us to play around with build configurations.

First, we will investigate how to create a CMake project and we will take a closer look at the typical structure of a project. Then, we will add some code and create an executable. Finally, we will add some unit tests using Google Test.

## Contents

<tableOfContents></tableOfContents>

## Creating a project

A CMake project is centered around the `CMakeLists.txt` file in the root of the project. To get started, create a `CMakeLists.txt` file with the following contents:

```
cmake_minimum_required(VERSION 4.2.3)

project(VectorArithmetic)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
```

What this does is indicate the version of CMake functionality that we want to use. In this case our CMake file will be read and executed as if using version 4.2.3. Note that this file can only be run using CMake 4.2.3 or higher and that in future versions some functionalities might no longer be supported. Additionally, it also sets the project name to `VectorArithmetic` and enforces the usage of C++ 23.

At this stage, we can also add a `README.md` to the root of our project. Documentation is a very important part of software engineering. You should always explain:
- the dependencies you used,
- how to set up the build system,
- how to run the application,
- how to run the unit tests,
- various examples of how to use your project,
- etc.

## Creating a library

We will now implement a class `FloatVector` and add some vector arithmetic functionality. Later on, we will call this code from the command line and from the unit tests. Since this code forms the core functionality of our project and will be used in different ways, we will instruct CMake to build this code as a library.

### Modifying the project settings

We will first add some extra subdirectories `src` and `include`. The `src` directory will contain the source files (`FloatVector.cpp` and `vector_arith.cpp`). The `include` folder will contain a single subdirectory `VectorArithmetic` that is the name of our project. In this directory, we add the header files (`FloatVector.hpp` and `vector_arith.hpp`).

If all is well, the file system of our project will now look as follows:

```
/project/
+-- src
|   +-- FloatVector.cpp
|   +-- vector_arith.cpp
+-- include
|   +-- VectorArithmetic
|       +-- FloatVector.hpp
|       +-- vector_arith.hpp
+-- CMakeLists.txt
+-- README.md
```

Next, we need to inform CMake that these files exist. First, we create a library and add our `.cpp` files as part of that library:

```
add_library(vector_arith_lib
    src/FloatVector.cpp
    src/vector_arith.cpp
)
```

Note that the <smart-link linkId="cmake_docs_build_shared" linkType="ext">default behaviour</smart-link> of libraries is static linking. This can either be changed to dynamic linking with the environment variable `BUILD_SHARED_LIBS=ON` or by passing the `SHARED` keyword. The difference between static and dynamic linking is that in the case of static linking, all the library code will become part of the executable. Dynamic linking causes the library code to be stored in a separate file. This is a technicality and does not alter the functional behaviour of our program.

We also need to specify where our header files will be located:

```
target_include_directories(vector_arith_lib
    PUBLIC
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
        $<INSTALL_INTERFACE:include>
)
```

The `BUILD_INTERFACE` refers to the location where headers are stored when building the project (i.e., inside the temporary `build` directory). The `INSTALL_INTERFACE` refers to where headers will be installed on a system in case an installation is performed. We will cover installation in a future article.

Using this `target_include_directories` function is very useful. It allows headers to be included  using the angled brackets `<...>`:
```cpp
#include <VectorArithmetic/FloatVector.hpp>
```

Using `<...>` to refer to headers is more portable and easier to use than for example the `"..."` syntax. The former does not depend on relative paths while the latter does. If we were to use `"..."` we would for example end up with:

```cpp
#include "../../FloatVector.hpp"
```

Now we have a `CMakeLists.txt` file that is fully configured to build our vector arithmetic library.

### Adding a dependency

As part of our functionality, we want the vector of floats to be represented as a string. To do this, we will use the <smart-link linkId="fmt_lib" linkType="ext">{fmt} library</smart-link>.

Adding a dependency using modern CMake is very easy. We just have to add the following code:

```
include(FetchContent)

# indicate where the code can be found
FetchContent_Declare(
  fmt
  GIT_REPOSITORY https://github.com/fmtlib/fmt.git
  GIT_TAG 10.2.1
)

# download
FetchContent_MakeAvailable(fmt)

# linking 
target_link_libraries(vector_arith_lib PRIVATE fmt::fmt)
```

This code uses the `FetchContent` module to download the contents of a GitHub repository. 
Note that with the `FetchContent_Declare` we can specify exactly how the code should be retrieved from the GitHub repository.
This code is then linked against our own library using `target_link_libraries`.

### Adding some code

Now that all our files are created and CMake knows how to compile them, it is time to add some C++ code. We will first create our `FloatVector` class.

In `FloatVector.hpp`:
```cpp
#pragma once

#include <vector>

/**
 * That that represents a vector of floating point numbers.
 */
class FloatVector {
private:
    std::vector<float> elements_;

public:
    /**
     * Constructor.
     */
    FloatVector(std::vector<float> elements)
        : elements_{elements}
    {}

    /**
     * The number of dimensions of the vector.
     */
    size_t num_dimensions();

    /**
     * Retrieve an element of the vector.
     */
    float get_element(size_t idx);

    /**
     * Sort the elements from low to high.
     */
    void sort();

    /**
     * Retrieve the maximum element.
     */
    float max();

    /**
     * Retrieve the minimum element.
     */
    float min();

    /**
     * Returns a string representation of the vector.
     */
    std::string to_string();
};
```

In `FloatVector.cpp`:

```cpp
#include <algorithm>
#include <fmt/format.h>
#include <fmt/ranges.h>

#include <VectorArithmetic/FloatVector.hpp>


size_t FloatVector::num_dimensions() {
    return this->elements_.size();
}

float FloatVector::get_element(size_t idx) {
    return this->elements_.at(idx);
}

void FloatVector::sort()
{
    std::sort(this->elements_.begin(), this->elements_.end());
}

float FloatVector::max()
{
    auto it = std::max_element(this->elements_.begin(), this->elements_.end());
    return *it;
}

float FloatVector::min()
{
    auto it = std::min_element(this->elements_.begin(), this->elements_.end());
    return *it;
}

std::string FloatVector::to_string()
{
    return fmt::format("[{}]", fmt::join(this->elements_, ", "));
}
```

Next, we will add the addition and dot-product for vectors. Recall that the sum of two vectors is another vector obtained by elementwise adding the two vectors together:

$$
    \vec{a} + \vec{b} = \left[ \begin{array}{c} 
    a_1 + b_1 \\ 
    a_2 + b_2 \\ 
    \dots \\
    a_n + b_n
    \end{array}  \right]
$$

The dot product of two vectors is the sum over the products of the elements:

$$
    \vec{a} \cdot \vec{b} = \sum_i a_i \cdot b_i
$$


In `vector_arith.hpp`:
```cpp
#pragma once

#include <VectorArithmetic/FloatVector.hpp>


/**
 * Element-wise addition of vectors.
 */
FloatVector add_vectors(FloatVector x, FloatVector y);

/**
 * Dot product of two vectors.
 */
float dot_product(FloatVector x, FloatVector y);
```

In `vector_arith.cpp`:
```cpp
#include <VectorArithmetic/vector_arith.hpp>

FloatVector add_vectors(FloatVector x, FloatVector y) {
    std::vector<float> result(x.num_dimensions());

    for(size_t i = 0; i < x.num_dimensions(); i++) {
        result.at(i) = x.get_element(i) + y.get_element(i);
    }

    return FloatVector{result};
}

float dot_product(FloatVector x, FloatVector y) {
    float result = 0.0;

    for(size_t i = 0; i < x.num_dimensions(); i++) {
        result += x.get_element(i) * y.get_element(i);
    }

    return result;
}
```

### Compilation

Finally, now that all our code is present, we can actually tell CMake to go ahead and compile our code into a library. In the terminal below we can see the exact commands and expected results:

<terminalBox>
<tTitle>zsh</tTitle>
<tCommand>cmake -S . -B build</tCommand>
<tResponse>-- The C compiler identification is AppleClang 17.x.x.x
-- The CXX compiler identification is AppleClang 17.x.x.x
...
-- Configuring done (28.1s)
-- Generating done (0.0s)
-- Build files have been written to: ./build</tResponse>
<tCommand>cmake --build build</tCommand>
<tResponse>[ 16%] Building CXX object _deps/fmt-build/CMakeFiles/fmt.dir/src/format.cc.o
[ 33%] Building CXX object _deps/fmt-build/CMakeFiles/fmt.dir/src/os.cc.o
[ 50%] Linking CXX static library libfmt.a
[ 50%] Built target fmt
[ 66%] Building CXX object CMakeFiles/vector_arith_lib.dir/src/FloatVector.cpp.o
[ 83%] Building CXX object CMakeFiles/vector_arith_lib.dir/src/vector_arith.cpp.o
[100%] Linking CXX static library libvector_arith_lib.a
[100%] Built target vector_arith_lib</tResponse>
</terminalBox>

The command `cmake -S . -B build` prepares all the necessary files in a new directory called `build`. The command `cmake --build build` tells CMake to call the C++ compiler and linker.

If all is well, the `build` directory now contains a file called `libvector_arith_lib.a` that contains our compiled library.

## Creating a command-line tool

Even though we have a fully compiled library `libvector_arith_lib.a`, we still cannot actually do anything with our code. Therefore, we will now make a small command line application to add two vectors together.

### Project configuration

First, add a directory `apps` with a single file `main.cpp`:

```
/project/
+-- src
|   +-- FloatVector.cpp
|   +-- vector_arith.cpp
+-- include
|   +-- VectorArithmetic
|       +-- FloatVector.hpp
|       +-- vector_arith.hpp
+-- apps
|   +-- main.cpp
+-- CMakeLists.txt
+-- README.md
```

Next, we tell CMake to compile this `main.cpp` into an executable program:

```
add_executable(vector_arith_cli
    apps/main.cpp
)

# tell CMake to use C++ 23
target_compile_features(vector_arith_cli PRIVATE cxx_std_23)

# make the vector arithmetic library available for the executable
target_link_libraries(vector_arith_cli
    PRIVATE vector_arith_lib
)
```

### C++ code

To make a command line application work, we will have to add some command line parsing as well as some code that takes the argument values and processes them.

In `main.cpp`, we first create a function that takes a string "a,b,c" and parses that into a vector of floats `[a, b, c]`:
```cpp
#include <iostream>
#include <ranges>

/**
 * Given a string of the format "a,b,c" this will return
 * a vector [a, b, c] of floats.
 */
std::vector<float> parse_vector(const std::string& s) {
    std::vector<float> result;

    for (auto part : s | std::views::split(',')) {
        std::string token(part.begin(), part.end());
        result.push_back(std::stof(token));
    }

    return result;
}
```

We also want a function that prints out a human-readable help menu that explains what our program does:
```cpp
void print_help(const char* prog) {
    std::cout << "Usage:\n"
              << "  " << prog << " -a \"<vec1>\" -b \"<vec2>\"\n\n"
              << "Options:\n"
              << "  -a <vec>    First vector (comma separated)\n"
              << "  -b <vec>    Second vector (comma separated)\n"
              << "  -h          Show this help menu\n"
              << "  -v          Show version\n" << std::endl;
}
```

We use the built-in POSIX `getopt.h` library to command line arguments and parses them. This will take a string such as `-a A -b B` and invoke the appropriate switch condition with the values `A` and `B`. That way we do not have to worry about manually parsing arguments using `argc` and `argv`.

```cpp
#include <getopt.h>

int parse_argument(int argc, char** argv, std::string &a_str, std::string &b_str) {
    int opt;
    while ((opt = getopt(argc, argv, "a:b:hv")) != -1) {
        switch (opt) {
            case 'a':
                a_str = optarg;
                break;

            case 'b':
                b_str = optarg;
                break;

            case 'h':
                print_help(argv[0]);
                return 0;

            case 'v':
                std::cout << "Vector arithmetic calculator version 1.0" << std::endl;
                return 0;

            default:
                print_help(argv[0]);
                return 1;
        }
    }

    return 0;
}
```

We can now create a `main()` function that calls the argument parsing and vector parsing and plugs those values into the vector arithmetic library we created earlier:

```cpp
#include <VectorArithmetic/FloatVector.hpp>
#include <VectorArithmetic/vector_arith.hpp>

// ...

int main(int argc, char** argv) {
    
    // parse arguments
    std::string a_str, b_str;
    int parse_result = parse_argument(argc, argv, a_str, b_str);
    if(parse_result != 0) {
        return 1;
    }

    if(a_str.empty() or b_str.empty()) {
        std::cout << "Error: a and b must be non-empty vectors!" << std::endl;
        return 1;
    }

    try {
        FloatVector a{parse_vector(a_str)};
        FloatVector b{parse_vector(b_str)};

        if(a.num_dimensions() != b.num_dimensions()) {
            std::cout << "Error: a and b must have the same number of dimensions!" << std::endl;
            return 1;
        }

        FloatVector sum = add_vectors(a, b);

        std::cout << "a: " << a.to_string() << "\n";
        std::cout << "b: " << b.to_string() << "\n";
        std::cout << "sum: " << sum.to_string() << "\n";
    } 
    catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << "\n";
        return 1;
    }

    return 0;
}
```

### Compilation

We can now use the same CMake commands as earlier to prepare a `build` folder and compile and link our program:

<terminalBox>
<tTitle>zsh</tTitle>
<tCommand>cmake -S . -B build</tCommand>
<tResponse>-- The C compiler identification is AppleClang 17.x.x.x
-- The CXX compiler identification is AppleClang 17.x.x.x
...
-- Configuring done (28.1s)
-- Generating done (0.0s)
-- Build files have been written to: ./build</tResponse>
<tCommand>cmake --build build</tCommand>
<tResponse>[ 12%] Building CXX object _deps/fmt-build/CMakeFiles/fmt.dir/src/format.cc.o
[ 25%] Building CXX object _deps/fmt-build/CMakeFiles/fmt.dir/src/os.cc.o
[ 37%] Linking CXX static library libfmt.a
[ 37%] Built target fmt
[ 50%] Building CXX object CMakeFiles/vector_arith_lib.dir/src/FloatVector.cpp.o
[ 62%] Building CXX object CMakeFiles/vector_arith_lib.dir/src/vector_arith.cpp.o
[ 75%] Linking CXX static library libvector_arith_lib.a
[ 75%] Built target vector_arith_lib
[ 87%] Building CXX object CMakeFiles/vector_arith_cli.dir/apps/main.cpp.o
[100%] Linking CXX executable vector_arith_cli
[100%] Built target vector_arith_cli</tResponse>
</terminalBox>

This will result in a new executable file called `vector_arith_cli`. If we then provide some function arguments, we can see that the vectors are correctly added:

<terminalBox>
<tTitle>zsh</tTitle>
<tCommand>./build/vector_arith_cli -a "1,2,3" -b "-3,2.6,203.4"</tCommand>
<tResponse>a: [1, 2, 3]
b: [-3, 2.6, 203.4]
sum a + b: [-2, 4.6, 206.4]</tResponse>
</terminalBox>

## Adding tests

Now that all our functionality is present, we will have to add tests. Such tests provide a fully automated way to verify that all the desired functionality is present and works as intended.

Each test is basically a function that calls our vector arithmetic library in a specific way. We can do this using the Google test framework.

### Setting up Google test

We once again our project structure. This time we add a `test` directory with two files called `float_vector_test.cpp` and `vector_arith_test.cpp`:

```
/project/
+-- src
|   +-- FloatVector.cpp
|   +-- vector_arith.cpp
+-- include
|   +-- VectorArithmetic
|       +-- FloatVector.hpp
|       +-- vector_arith.hpp
+-- apps
|   +-- main.cpp
+-- test
    +-- float_vector_test.cpp
    +-- vector_arith_test.cpp
+-- CMakeLists.txt
+-- README.md
```

Next, we need to tell CMake what Google test is and how to add it to our project. We will once again use the `FetchContent` module to download Google test from GitHub:


```
# download and compile google test
include(FetchContent)

FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
)

FetchContent_MakeAvailable(googletest)

enable_testing()

# create test executable and link it to our vector arithmetic library
add_executable(
  vector_arith_test
  test/float_vector_test.cpp
  test/vector_arith_test.cpp
)

target_link_libraries(
  vector_arith_test
  GTest::gtest_main
  vector_arith_lib
)

# tell Google Test to search for unit tests
include(GoogleTest)
gtest_discover_tests(vector_arith_test)
```

Notice that we are adding another executable called `vector_arith_test`. This executable will not call our previously coded `main` function. Instead, it will call a specific routine provided by Google tests that automatically executes all our unit tests.


### Adding a test

CMake is now fully configured to compile and run unit tests. Next, we will define some actual tests code.

The basic format for this is 
```cpp
TEST(TestSuiteName, TestName) {
    // ... test code ...
}
```

Here, `TestSuiteName` refers to the name of the test suite that the unit test belongs to. A test suite collection of unit tests. The `TestName` is the name of this specific test. In larger projects is can be useful to organise unit tests as part of test suites.


We first add a test called `ToString` to test that vectors can be correct converted into a string format using `.toString()`:

In `float_vector_test.cpp`
```cpp
#include <gtest/gtest.h>

#include <VectorArithmetic/FloatVector.hpp>

TEST(FloatVectorTest, ToString) {
    {% raw %}FloatVector x{{0.0, 1.0, 2.4}}; {% endraw %}

    EXPECT_STREQ(x.to_string().c_str(), "[0, 1, 2.4]");
    EXPECT_EQ(7 * 6, 42);
}
```

We do the same for `.num_dimensions()` and `.max()`:

```cpp
TEST(FloatVectorTest, NumDimensions) {
    {% raw %}FloatVector x{{0.0, 1.0, 2.0}}; {% endraw %}

    EXPECT_EQ(x.num_dimensions(), 3);
}

TEST(FloatVectorTest, Max) {
    {% raw %}FloatVector x{{0.0, 1.0, 2.0}}; {% endraw %}

    EXPECT_FLOAT_EQ(x.max(), 2.0);
}
```

The `EXPECT_EQ(x,y)`, `EXPECT_STREQ(x,y)`, `EXPECT_FLOAT_EQ(x,y)` are called <em>asserts</em>. If `x` and `y` are equal, then such an assert indicates to Google test that everything is in order. If `x` and `y` are not equal, then Google test will report that something went wrong.

We now also add tests for vector arithmetic. We group these tests in the test suite `VectorArithmeticTest`.

In `vector_arith_test.cpp`:

```cpp
#include <gtest/gtest.h>

#include <VectorArithmetic/FloatVector.hpp>
#include <VectorArithmetic/vector_arith.hpp>

TEST(VectorArithmeticTest, TestAddition) {
    {% raw %}FloatVector x{{1.0, 2.4, -3.0}};{% endraw %}
    {% raw %}FloatVector y{{-3.2, 4.0, 5.5}};{% endraw %}

    auto sum = add_vectors(x, y);

    EXPECT_FLOAT_EQ(sum.get_element(0), 1.0 + (-3.2));
    EXPECT_FLOAT_EQ(sum.get_element(1), 2.4 + 4.0);
    EXPECT_FLOAT_EQ(sum.get_element(2), -3.0 + 5.5);
}


TEST(VectorArithmeticTest, TestDotProduct) {
    {% raw %}FloatVector x{{1.0, 2.4, -3.0}};{% endraw %}
    {% raw %}FloatVector y{{-3.2, 4.0, 5.5}};{% endraw %}

    const float dot = dot_product(x, y);

    EXPECT_FLOAT_EQ(dot, 1.0 * -3.2 + 2.4 * 4.0 + (-3.0) * 5.5);
}
```

### Running tests

Now it is time to compile and run our tests. We once again use the commands from before to compile and link our project:

<terminalBox>
<tTitle>zsh</tTitle>
<tCommand>cmake -S . -B build</tCommand>
<tResponse>...</tResponse>
<tCommand>cmake --build build</tCommand>
<tResponse>...
[ 50%] Building CXX object _deps/googletest-build/googletest/CMakeFiles/gtest.dir/src/gtest-all.cc.o
[ 55%] Linking CXX static library ../../../lib/libgtest.a
[ 55%] Built target gtest
[ 61%] Building CXX object _deps/googletest-build/googletest/CMakeFiles/gtest_main.dir/src/gtest_main.cc.o
[ 66%] Linking CXX static library ../../../lib/libgtest_main.a
[ 66%] Built target gtest_main
[ 72%] Building CXX object CMakeFiles/vector_arith_test.dir/test/float_vector_test.cpp.o
[ 77%] Linking CXX executable vector_arith_test
[ 77%] Built target vector_arith_test
[ 83%] Building CXX object _deps/googletest-build/googlemock/CMakeFiles/gmock.dir/src/gmock-all.cc.o
[ 88%] Linking CXX static library ../../../lib/libgmock.a
[ 88%] Built target gmock
[ 94%] Building CXX object _deps/googletest-build/googlemock/CMakeFiles/gmock_main.dir/src/gmock_main.cc.o
[100%] Linking CXX static library ../../../lib/libgmock_main.a
[100%] Built target gmock_main</tResponse>
</terminalBox>

Next, we `cd` into the build directory and call the `ctest` utility, which executes all our tests:

<terminalBox>
<tTitle>zsh</tTitle>
<tCommand>cd build && ctest</tCommand>
<tResponse>Test project /VectorArithmetic/build
    Start 1: FloatVectorTest.ToString
1/8 Test #1: FloatVectorTest.ToString ..............   Passed    0.01 sec
    Start 2: FloatVectorTest.NumDimensions
2/8 Test #2: FloatVectorTest.NumDimensions .........   Passed    0.01 sec
    Start 3: FloatVectorTest.GetElement
3/8 Test #3: FloatVectorTest.GetElement ............   Passed    0.01 sec
    Start 4: FloatVectorTest.Sort
4/8 Test #4: FloatVectorTest.Sort ..................   Passed    0.01 sec
    Start 5: FloatVectorTest.Max
5/8 Test #5: FloatVectorTest.Max ...................   Passed    0.01 sec
    Start 6: FloatVectorTest.Min
6/8 Test #6: FloatVectorTest.Min ...................   Passed    0.01 sec
    Start 7: VectorArithmeticTest.TestAddition
7/8 Test #7: VectorArithmeticTest.TestAddition .....   Passed    0.01 sec
    Start 8: VectorArithmeticTest.TestDotProduct
8/8 Test #8: VectorArithmeticTest.TestDotProduct ...   Passed    0.01 sec

100% tests passed, 0 tests failed out of 8

Total Test time (real) =   0.06 sec</tResponse>
</terminalBox>

From this we can see that all our tests passed. If any tests fail, then Google test will indicate that in the output of `ctest`. Also note that the name of each individual test is displayed clearly, indicating both the name of the unit test and the test suite it belongs to.

## Conclusions

In this article we explored how to set up a (very) small C++ project using CMake. This project contains all the essentials such as headers, source files, dependencies, executables, and automated unit tests. In doing so, we have created a small vector arithmetic library and compiled it as a library. We then built small command line application that parses command line arguments using `getopt.h` and linked that application against our vector arithmetic library. Finally, we wrote a few unit tests using Google Test.

In the future I am interested in concepts that build on top of this tutorial, such as deploying the code in a Docker container, building a Python interface for the C++ code, and using other build systems such as Meson.
