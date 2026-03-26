---
layout: page
title: Managing Java installations on macOS
permalink: /posts/buildsystems/java_home_macos
exclude: true
referenceId: java_home_macos
---

<div>
{% include enable_image_zoom.html %}
</div>

<div>
{% include enable_title_numbering.html %}
</div>

## Introduction

A lot of software is written in the Java programming language. In order to run Java programs on your computer, you need to install the Java runtime. This runtime is available for many systems, including macOS.

Different versions of Java have come out over the years. Sometimes certain projects only run on specific versions of the Java runtime.
In order to deal with this, one needs to be able to choose which Java runtime to use for which software. 

One specific use-case is Minecraft: older versions of Minecraft do not work on modern versions of Java. Such a lack of backwards compatibility can happen if a piece of software relies on specific deprecated Java features or when specific internal properties of the JVM are relied on.

Luckily, it is possible to install different Java versions on your system. There is a problem, however: what happens if I execute the `java` command in the terminal? Which version of Java will it use?

On Ubuntu there is a very useful utility called `update-alternatives` that lets you switch between Java versions.
On macOS, however, we will need a different tool.

In this article we will explore how to install different Java versions using Homebrew and how to switch between then using the `java_home` utility that comes with macOS.

I originally found the techniques in this tutorial on [this Stackoverflow article](https://stackoverflow.com/questions/21964709/how-to-set-or-change-the-default-java-jdk-version-on-macos).

## Overview

<tableOfContents></tableOfContents>


## Installing Java versions

Even though there is only one Java programming language, there are many different Java implementations available. We call them "Java distributions". Examples are Oracle's OpenJDK, Eclipse Temurin, and Amazon Corretto.

In this article we will use Eclipse Temurin. We can use Homebrew to install the latest version:

<terminalBox data-minimal>
  <tTitle>Bash</tTitle>
  <tCommand>brew install --cask temurin</tCommand>
</terminalBox>

Alternatively, it is possible to install specific versions:

<terminalBox data-minimal>
  <tTitle>Bash</tTitle>
  <tCommand>brew install --cask temurin@8</tCommand>
  <tCommand>brew install --cask temurin@17</tCommand>
  <tCommand>brew install --cask temurin@24</tCommand>
</terminalBox>


A full list of available Java versions can be obtained using `brew search temurin`:

<terminalBox data-minimal>
  <tTitle>Bash</tTitle>
  <tCommand>brew search temurin</tCommand>
  <tResponse>==> Casks
temurin ✔    temurin@17 ✔             temurin@20 (deprecated)  temurin@25
temurin@11   temurin@19 (deprecated)  temurin@21               temurin@8</tResponse>
</terminalBox>

## How macOS keeps track of Java versions

The Java runtime installations on macOS are all located in `/Library/Java/JavaVirtualMachines/`. This directory has one sub-directory for each Java installation.

Each such a sub-directory has the following standard structure:
```
/Library/Java/JavaVirtualMachines/
+-- temurin-17.jdk
+-- temurin-24.jdk
    +-- Contents
        +-- Home
        |   +-- bin
        |   +-- lib
        |   +-- ...
        +- ...
```

The `temurin-17.jdk` and `temurin-24.jdk` directories represent the Eclipse Temurin installations for Java versions 17 and 24, respectively.

The built-in utility `/usr/libexec/java_home` allows us to access these installations. We can, for example, retrieve the installation directory associated with specific Java versions:

<terminalBox data-minimal>
  <tTitle>zsh</tTitle>
  <tCommand>/usr/libexec/java_home -v17</tCommand>
  <tResponse>/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home</tResponse>
  <tCommand>/usr/libexec/java_home -v24</tCommand>
  <tResponse>/Library/Java/JavaVirtualMachines/temurin-24.jdk/Contents/Home</tResponse>
</terminalBox>

As we can see, the `java_home` utility tells us where the `Home` directory for a specific Java version can be found. Since we know that each such `Home` directory has an executable `/bin/java`, we then also know how to execute the Java runtime.

To get an overview of all installed Java JDK's:
<terminalBox data-minimal>
  <tTitle>zsh</tTitle>
  <tCommand>/usr/libexec/java_home -V</tCommand>
  <tResponse>Matching Java Virtual Machines (2):
    24.x.x (arm64) "Eclipse Adoptium" - "OpenJDK 24.x.x" /Library/Java/JavaVirtualMachines/temurin-24.jdk/Contents/Home
    17.x.x (arm64) "Eclipse Adoptium" - "OpenJDK 17.x.x" /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/temurin-24.jdk/Contents/Home</tResponse>
</terminalBox>

If we use `-X` instead of the `-V` flag, then we can retrieve this overview in XML format.

## Switching between Java versions

The `java` executable is located at `/usr/bin/java`. Even though it is located at that path, that is not where Java is installed. When we execute `java`, then the executable consults the value of the `JAVA_HOME` environment variable. It then assumes that actual Java runtime is located at `$JAVA_HOME/bin/java`.

Therefore, by changing the value of `JAVA_HOME`, we can point macOS to the right Java runtime.

If we execute the `java` command then we see that the current version is, for example, version 24.

<terminalBox data-minimal>
  <tTitle>zsh</tTitle>
  <tCommand>java --version</tCommand>
<tResponse>openjdk 24.x.x xxxx-xx-xx
OpenJDK Runtime Environment Temurin-24.x.x+x (build 24.x.x+x)
OpenJDK 64-Bit Server VM Temurin-24.x.x+x (build 24.x.x+x, mixed mode, sharing)</tResponse>
</terminalBox>

We can then change the value of `JAVA_HOME` to point to home directory of Java 17:

<terminalBox data-minimal>
  <tCommand>export JAVA_HOME=$(/usr/libexec/java_home -v17)</tCommand>
</terminalBox>

If we run the `java` command again, we see that the Java version has now changed:

<terminalBox data-minimal>
  <tCommand>java --version</tCommand>
<tResponse>openjdk 17.x.x xxxx-xx-xx
OpenJDK Runtime Environment Temurin-17.x.x+x (build 17.x.x+x)
OpenJDK 64-Bit Server VM Temurin-17.x.x+x (build 17.x.x+x, mixed mode, sharing)</tResponse>
</terminalBox>

Note that this is process is fully transparent. After changing the `JAVA_HOME` variable we just run the `java` command to run the new Java version. We do not have to change the command that we are using.

## Adding commands to easily switch between Java versions

Since the commands to change `JAVA_HOME` are quite long and cumbersome we will create a few aliases. An alias is a small "shortcut" for a longer terminal command.

Aliases can be set and modified in the `.zshrc` file in the home folder. Note that this is only relevant if we use Z shell.
Other shells do not make use of `.zshrc`.

We first store the locations of various home folders of our available Java installations in different variables. For example, if we have installed Java versions 8, 17, and 24, then we can store the respective home folders:

```zsh
# retrieve the locations of Java versions
export JAVA_8_HOME=$(/usr/libexec/java_home -v1.8)
export JAVA_17_HOME=$(/usr/libexec/java_home -v17)
export JAVA_24_HOME=$(/usr/libexec/java_home -v24)
```

Then, we add the actual aliases that modify `JAVA_HOME` with the `export` command:

```zsh
# some commands to activate Java
alias activate_java8='export JAVA_HOME=$JAVA_8_HOME'
alias activate_java17='export JAVA_HOME=$JAVA_17_HOME'
alias activate_java24='export JAVA_HOME=$JAVA_24_HOME'
```

In order for the changes in `.zshrc` to have an effect, we need to close our terminal and open a new instance. If we now use our terminal, we can see that our newly defined commands alter the active Java installation:

<terminalBox data-minimal>
  <tTitle>zsh</tTitle>
  <tCommand>activate_java24</tCommand>
  <tCommand>java --version</tCommand>
<tResponse>openjdk 24.x.x xxxx-xx-xx
OpenJDK Runtime Environment Temurin-24.x.x+x (build 24.x.x+x)
OpenJDK 64-Bit Server VM Temurin-24.x.x+x (build 24.x.x+x, mixed mode, sharing)</tResponse>
  <tCommand>activate_java17</tCommand>
  <tCommand>java --version</tCommand>
<tResponse>openjdk 17.x.x xxxx-xx-xx
OpenJDK Runtime Environment Temurin-17.x.x+x (build 17.x.x+x)
OpenJDK 64-Bit Server VM Temurin-17.x.x+x (build 17.x.x+x, mixed mode, sharing)</tResponse>
</terminalBox>


## Java compilers and development environments

The tutorial above only concerns the Java version of the `java` command in the terminal. However, we will also have to select a Java version when writing and compiling Java code. The Java software needed to compile and run Java code during development is called a Java development kit (JDK). 
Build systems such as Gradle and IDEs such as IntelliJ and VSCode have built-in settings to select the desired JDK.

## Conclusion
 
In this article we have explored how to select a specific Java version in the macOS terminal. We have seen how to install different Java runtimes via Homebrew and how to select the default Java version using `java_home` and `JAVA_HOME`.

In the future I am planning on writing more articles related to software engineering and build infrastructure. Stay tuned!
