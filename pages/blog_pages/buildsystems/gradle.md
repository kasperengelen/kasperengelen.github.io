---
layout: page
title: Gradle
permalink: /posts/buildsystems/gradle
exclude: true
referenceId: gradle
---

<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_buildsystems_gradle %}
</div>

<div>
{% include enable_title_numbering.html %}
</div>

## Introduction

When programming in Java, we can choose from various build systems such as Ant, Maven, and Gradle. In this article we will cover the basics of the latter. The Gradle build tool allows us to define tasks such as compiling, running, and testing. Additionally, it provides dependency management functionalities.

Given that Gradle is a big and complex tool, we will only be covering the basics in this article. To do this, we will code a simple command-line tool to detect palindromes, and export it, both as a zip-file and as a jar-file. The project will consist of some source code, a few tests, and the necessary dependencies.

Finally, we will be using Gradle from the command line. Even though Gradle has excellent support in tools such as IntelliJ, the IDE plugins hide all the Gradle technicalities behind a GUI. In order to troubleshoot problems, and in order to get a good grip on how Gradle works, it is essential to master the command-line interface of Gradle.

## Overview

<tableOfContents></tableOfContents>

## Creating a project

The first step to getting started with Gradle is, of course, to install the Gradle tool. On MacOS this can be done using Homebrew:
```
brew install gradle
```

The next step is to create a new Gradle project. For this we navigate to the directory where we want our project to be located, and run the following command:
```
gradle init --type java-application --dsl kotlin
```

This will create a Java application, and use the Kotlin language for specifying Gradle build settings. The Gradle tool will then prompt for various informations. We use the following settings:
- Java version 21,
- project name "gradle_tutorial",
- JUnit 4 as the testing framework,
- no experimental Gradle features.

You will also be asked to choose between "single application project" and "application and library project". The second option is more advanced and allows you split bigger projects into multiple libraries. **In this tutorial will be using the first option, which is less complicated.** Still, most steps in this tutorial should be applicable to both options.

## Gradle project structure

Once the project is created, some example files have been created as well. The full file-tree should be as follows:
```
.
+-- app
|   +-- src
|   +-- build.gradle.kts
+-- gradle
|   +-- wrapper
|   +-- libs.versions.toml
+-- gradlew
+-- gradlew.bat
+-- settings.gradle.kts
```

The `app/src` directory is used to store code that will be used when running and testing the application. The name of the `app` directory is arbitrary. We will rename this directory to `palindrome_checker`. This is done in two steps:
- rename the `app` directory itself,
- modify the `include("app")` line in the `settings.gradle.kts` file.

Note that in this way it is also possible to add multiple sub-projects. In this tutorial will will only use our newly renamed `palindrome_checker` sub-project.

## Dependencies

Our program will accept input from the command-line and report whether or not that input was a palindrome. Additionally, we will want to verify that our program works as intended by unit testing our code.

Reading input from the command-line will be done using the <smart-link linkType="ext" linkId="jcommander_website">JCommander</smart-link> library. In order to check whether the input is a palindrome, we will use the `StringUtils` class from the <smart-link linkType="ext" linkId="apache_commons_website">Apache Commons Lang</smart-link> library. Finally, we will use <smart-link linkType="ext" linkId="junit_4_website">JUnit 4</smart-link> for the tests.

Even though using a Maven repository is the most convenient, we will also show how to add local JAR-files as dependencies, for the purpose of demonstration.

### Retrieving dependencies from Maven Central

Even though this is not strictly necessary, it is recommended to specify the exact names and versions of each library in the `libs.versions.toml` file in the `gradle` directory. If we open it, we see that some libraries are already present:

```toml
[versions]
guava = "33.2.1-jre"
junit = "4.13.2"

[libraries]
guava = { module = "com.google.guava:guava", version.ref = "guava" }
junit = { module = "junit:junit", version.ref = "junit" }
```

We can see that JUnit is already present, so we don't need to do anything there. The Google Guava library, however, is not needed and can be removed. We will now need to add the Apache Commons Lang library by adding two lines. The result is as follows:

```toml
[versions]
junit = "4.13.2"
commons-lang = "3.17.0"

[libraries]
junit = { module = "junit:junit", version.ref = "junit" }
commons-lang = { module = "org.apache.commons:commons-lang3", version.ref = "commons-lang" }
```

The "module" and "version" fields refer to where Apache Commons and JUnit are stored on Maven Central. When building the project, Gradle will automatically download the necessary files. Very convenient! More libraries can be found on the <smart-link linkType="ext" linkId="maven_central">Maven Central website</smart-link>.

Next, we still need to tell our `palindrome_checker` sub-project to use these libraries. This is done by modifying the `build.gradle.kts` file in the `palindrome_checker` directory. If we look at the `dependencies` section of that file, we can see that two libraries are already present:

```kotlin
dependencies {
    // Use JUnit test framework.
    testImplementation(libs.junit)

    // This dependency is used by the application.
    implementation(libs.guava)
}
```

Once again, we remove the Google Guava library. The JUnit library is already present, with `libs.junit` referring to the entry in the `libs.versions.toml` file. The `testImplementation` is a so-called <smart-link linkType="ext" linkId="gradle_dep_configs">dependency configuration</smart-link>, which specifies that this library is only needed for the testing stage of the project.

Adding the Apache Commons Lang library is very simple:

```kotlin
dependencies {
    // Use JUnit test framework.
    testImplementation(libs.junit)

    // Used for palindrome checking.
    implementation(libs.commons.lang)
}
```

Note that Apache Commons Lang is added using the `implementation` configuration, since it will be used while running the application itself.

### Adding JAR-files as dependencies

We will now add the JCommander library to the project as a JAR-file. The <smart-link linkType="ext" linkId="jcommander_maven_central">JCommander page</smart-link> on the Maven Central website has a section "files" with a link to the JAR-file. We will store this JAR-file as as `jcommander-2.0.jar` in a newly created folder `palindrome_checker/libs`:

```
.
+-- palindrome_checker
    +-- libs
        +-- jcommander-2.0.jar
```

Next, we will have to tell Gradle to look for this file by referring to it in the `build.gradle.kts` file. This requires two things: adding JCommander as a dependency, and telling Gradle where the dependency can be found.

```kotlin
dependencies {
    // Use JUnit test framework.
    testImplementation(libs.junit)

    // Used for palinedrome checking
    implementation(libs.commons.lang)

    // looks for the jar file in "palindrome_checker/libs"
    implementation(files("libs/jcommander-2.0.jar"))
}
```

In order to tell Gradle where these JAR-files can be found, we have to add another repository:

```kotlin
repositories {
    // Use Maven Central for resolving dependencies.
    mavenCentral()

    // add local libraries
    flatDir {
        dirs("libs")
    }
}
```

## Adding source code

Now that we have all the necessary dependencies installed, we can proceed by writing the actual code. The code will be stored in `palindrome_checker/src`. Note that file structure of a Java application can look a bit complicated at first.

```
.
+-- palindrome_checker
    +-- src
        +-- main
        |   +-- java
        |   |   +-- org
        |   |       +-- example
        |   |           +-- App.java
        |   +-- resources
        +-- test
            +-- java
            |   +-- org
            |       +-- example
            |           +-- AppTest.java
            +-- resources
```

This `src` directory has two sub-directories: `main` for application code, and `test` for unit-tests. Inside the `main` and `test` directories there are again two folders: `java`, for code, and `resources`, for extra files such as images, sounds or data. The `java` folder will contain various folders called "packages" that in turn contain `.java` files with Java code. 

In Java there are classes, which contain functionality, and packages, which group multiple classes together. The package-structure must be identical to the directory-structure of the project. If we look inside `palindrome_checker/src/main/java` we see `org/example/App.java`. Here, the package is `org.example` with a class `App` in the `App.java` file.

### Adding a Main class

We will now delete the `org` folder in both `main` and `test`, in order to remove the example code. Instead, we create a package `palindrome_checker` with a class `Main`:

```
.
+-- palindrome_checker
    +-- src
        +-- main
        |   +-- java
        |   |   +-- palindrome_checker
        |   |       +-- Main.java
        |   +-- resources
        +-- test
            +-- java
            +-- resources
```

We will begin the `Main.java` file with a simple hello world example.

```java
package palindrome_checker;

/**
 * Main class.
 */
public class Main {

    /**
     * Entry point of the program.
     */
    public static void main(String[] args) {
        System.out.println("Hello world!");
    }
}
```

The `main` method is called the entry-point of the program. In order to run our code, Gradle first needs to know where this entry point it is located. We can tell Gradle where to find our `Main` class by modifying the `build.gradle.kts` file:

```kotlin
application {
    // Define the main class for the application.
    mainClass = "palindrome_checker.Main"
}
```

We can now run our Hello World example by calling the `run` task via the command line:

```
./gradlew run
```

### Adding command line arguments

Now that we have all our dependencies, as well as a main function, we can start adding the actual functionality that we want for our application. As mentioned earlier, we will use the JCommander library to parse command-line arguments. 

For this, we will first need to create a class that will specify the different types of arguments. JCommander will use this class to find and retrieve command-line arguments. Once the parsing is done, an object of that class will be created and used to store the actual values of the arguments. We will call this class `Arguments`:

```java
package palindrome_checker;

import com.beust.jcommander.Parameter;

/**
 * Class that specifies the arguments of the program.
 */
public class Arguments {
    // allows the user to ask for help
    @Parameter(names = {"-h", "--help"}, help=true)
    public boolean help;

    // allows the user to specify the word that might be a palindrome
    @Parameter(names = { "-w", "--word" },
            description = "The word that might be a palindrome.",
            required=true)
    public String word;
}
```

We can see that there are two types of arguments: `--help` and `--word`. For each argument the type is specified, as well as the name, description, and whether the argument is required or not. Also note that it is possible to specify multiple alternative names for an argument: both `-w` and `--word` will work.

The `--help` argument is a bit special, and it has the `help` flag set to true. This informs JCommander that this is a special argument. Even though the `--word` argument is required, if we type in `--help`, then JCommander will ignore this and just allow us to print a help menu.

Now that we have a full specification of all the arguments, it is time to invoke the JCommander library. When parsing arguments, a standard structure can be added to the main function:

```java
package palindrome_checker;

/**
 * Main class.
 */
public class Main {

    /**
     * Entry point of the program.
     */
    public static void main(String[] args) {
        // tell JCommander what kind of arguments we need
        Arguments parsedArgs = new Arguments();
        JCommander jc = JCommander.newBuilder().addObject(parsedArgs).build();
        
        try {    
            // parse arguments from the array of strings
            jc.parse(args);

            // print help if needed
            if (parsedArgs.help) {
                jc.usage();
                return;
            }

            // retrieve argument value
            String word = parsedArgs.word;

            // do something with the argument values
            System.out.println("The following word was given: '" + word + "'");

        } catch (ParameterException e) {
            // tell the user what went wrong
            System.err.println(e.getLocalizedMessage());
            jc.usage();
        }
    }
}
```

This standard structure does the following things:
- tell JCommander what kind of arguments we need,
- ask JCommander to parse argument values from `String[] args`,
- print the help menu if needed,
- do something with the given argument values.

Also note that the entire thing is surrounded with a try-catch to check for errors.

If we now do `./gradlew run`, we can see that our program asks for the missing arguments:

```
The following option is required: [-w | --word]
Usage: <main class> [options]
  Options:
    -h, --help

  * -w, --word
      The word that might be a palindrome.
```

We can pass a value for the `--word` argument:
```
./gradlew run --args="--word Hello"
```

The output of our program is then as follows:

```
The following word was given: 'Hello'
```

### Checking for palindromes

Now that we can use command-line arguments to receive input, we now have to check whether that input is a palindrome. We will first create a `PalindromeChecker` class with an `isPalindrome` method. This method will then be called from the main function.

```java
package palindrome_checker;

import org.apache.commons.lang3.StringUtils;

/**
 * Class to check whether a word is a palindrome.
 */
public class PalindromeChecker {
    public PalindromeChecker() {}

    /**
     * Check for palindromes.
     *
     * @param word A string that might be a palindrome.
     * @return True if the string is a palindrome, false otherwise.
     */
    public boolean isPalindrome(String word) {
        return StringUtils.reverse(word).equals(word);
    }
}
```

The implementation is very easy: we use `StringUtils.reverse()` from the Apache Commons library to reverse the input string. We then check whether that reversed string is equal to the original string, using the `.equals()` method.

Calling this `isPalindrome` method is very easy. We simply create an instance of the `PalindromeChecker` class and pass a string to the method. The return value can then be used in an if-statement:

```java
PalindromeChecker checker = new PalindromeChecker();

if(checker.isPalindrome(word)) {
    System.out.println("Input '" + word + "' is a palindrome.");
} else {
    System.out.println("Input '" + word + "' is not a palindrome.");
}
```

If we call our program using `--word abccba`, we get confirmation that it is indeed a palindrome:

```
Input 'abccba' is a palindrome.
```

On the other hand, if we call our program using `--word Hello` we can see that our program correctly detects that this is not a palindrome:

```
Input 'Hello' is not a palindrome.
```

## Adding tests

Even though we tested our tool on some simple inputs, we still need to be sure that everything works correctly by unit-testing our code. We assume that JCommander does its job correctly, and only write some tests for the `PalindromeChecker` class.

Before we can add test code, we will first need to create a package and a `.java` file. The `palindrome_checker/src/test/` directory currently looks as follows:

```
test
+-- java
+-- resources
```

In the `test/java` directory, we create a `palindrome_checker` sub-directory, together with a file called `PalindromeCheckerTest.java`. This java file will contain our tests:

```java
package palindrome_checker;

import org.junit.Test;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

/**
 * Tests for the PalindromeChecker class.
 */
public class PalindromeCheckerTest {
    // ... add test methods here ...
}
```

The tests themselves can be added by defining methods annotated with `@Test`. To start off, we will deal with the simplest possible palindromes: words of a single character. All words that only contain a single character must be palindromes. In order to test this, we call our palindrome checker on such a single character, and check that the return value is true, using the `assertFalse` method. The result is as follows:

```java
/**
 * Test to verify that single characters are always palindromes.
 */
@Test
public void testSingleCharacter() {
    PalindromeChecker checker = new PalindromeChecker();
    assertTrue(checker.isPalindrome("a"));
    assertTrue(checker.isPalindrome("b"));
    assertTrue(checker.isPalindrome("c"));
    assertTrue(checker.isPalindrome("x"));
    assertTrue(checker.isPalindrome("0"));
    assertTrue(checker.isPalindrome("9"));
}
```

Of course, users will want to check more complicated words as well. We therefore create another test method for bigger words and come up with some more words. For the word `abccba` we want the checker to return true. The word `abcdef` is not a palindrome, however, and the checker should return false. We can check for `false` return values using the `assertFalse` method.

```java
/**
 * Test for some bigger words.
 */
@Test
public void testBig() {
    PalindromeChecker checker = new PalindromeChecker();
    assertTrue(checker.isPalindrome("abccba"));
    assertFalse(checker.isPalindrome("abcdef"));
}
```

Finally, it might be useful for a user to check bit-patterns for palindromes. To verify that this works as expected, we come up with some bit-patterns, and check the return value of the palindrome checker.

```java
/**
 * Test for binary numbers.
 */
@Test
public void testBinary() {
    PalindromeChecker checker = new PalindromeChecker();
    assertTrue(checker.isPalindrome("010010"));
    assertFalse(checker.isPalindrome("110110001"));
}
```

We can ask Gradle to automatically execute all tests:

```
./gradlew test
```

Gradle will then run all tests and report on the result. If any test failed, it will be reported in the terminal output.

## Tasks

In the previous sections we have invoked a utility called `gradlew` together with arguments such as `run`, `test`, etc. The `gradlew` utility is called the <em>Gradle wrapper</em>, and allows the developer to access specific Gradle functionalities. The arguments such as `run` and `test` are called <em>tasks</em>.

By running `./gradlew tasks` we can see which tasks there are available. The list printed by Gradle is very big, so we will list a few interesting ones below:
- `run`: run the code in `src/main`,
- `run --args="x y z"`: run the code in `src/main` with arguments `x`, `y`, and `z`,
- `test`: execute the unit tests defined in `src/test/`,
- `clean`: remove all files in the `build` directory.

Note that some of the tasks listed above were provided by Gradle by default, while others might be provided by plugins. It is also possible to define custom Gradle tasks yourself.

The `./gradlew` command will work on UNIX systems, such as Linux and MacOS. If you are working on a Windows computer, you will have to use the `gradlew.bat` file.

## Compiling and exporting as an executable

Now that we have coded and tested our program, it is time to send it to our users! Of course, we cannot just send our Gradle project, since users do not want to spend their time figuring out how to use Gradle by reading this article. In the two sections below, we will explore two different export formats: zip-files and jar-files.

### Exporting as a ZIP

We will first cover how to export our program as a zip-file. The `distZip` task does just that: it builds our program, groups the compiled class files together with the dependencies, and packages it all as a single zip-file.

We can run this task as follows:
```
./gradlew distZip
```

If we now look in the `palindrome_checker/build/` folder, we see that there is a sub-directory called `distributions` with a single file `palindrome_checker.zip`.

If we unpack the zip-file, we see the following file structure:

```
palindrome_checker
+-- bin
|   +-- palindrome_checker
|   +-- palindrome_checker.bat
|
+-- lib
    +-- commons-lang3-3.17.0.jar
    +-- jcommander-2.0.jar
    +-- palindrome_checker.jar
```

The `lib` folder contains the actual java code of our program and its dependencies. The `bin` folder contains two executables that were generated by Gradle, in order to easily run our program. If we open a terminal in the root-directory of the unpacked zip, we can run our program as follows:

```
./bin/palindrome_checker --word racecar
```

The command above will only work on a UNIX system. When working with Windows we will have to use `palindrome_checker.bat`.

### Exporting as a JAR

In the previous section, we learned how to package our application as a zip-file. Another commonly-used export format is the JAR-file.

Creating a JAR-file is classically done by packaging the program as a so-called <em>fat jar</em>, which then also contains all the dependencies of a program. In Gradle, this can be done with the <smart-link linkType="ext" linkId="shadow_plugin_website">Shadow plugin</smart-link>. The plugin can be added by modifying the `plugins` section of `build.gradle.kts`:

```
plugins {
    // ...

    id("com.gradleup.shadow") version "8.3.2"

    // ...
}
```

If we now invoke the `shadowJar` task using `./gradlew shadowJar`, we see that a file `palindrome_checker-all.jar` has been generated in `libs` sub-directory of `palindrome_checker/build/`.

We can run this jar-file from the command-line:

```
java -jar palindrome_checker-all.jar --word racecar
```

## Conclusion

In this article we have explored the Gradle build system for Java applications. We first created a project, cleaned up the dummy code provided by default, added our own code, and wrote some automated unit-tests. Finally, we exported our code both as a zip-file as well as a jar-file.

Note that we have only explored the basics, however. Gradle also supports projects with multiple sub-projects, projects that have GUIs, continuous integration platforms, etc. Nonetheless, the tutorial above should suffice for getting started with simple command-line applications, which is ideal for small projects and research prototypes.

The code for this tutorial can be found <smart-link linkType="ext" linkId="gradle_tutorial_github_code">on GitHub</smart-link>.

