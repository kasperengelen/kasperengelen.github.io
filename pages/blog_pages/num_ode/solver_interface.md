---
layout: page
title: An interface for ODE solvers
permalink: /posts/num_ode/solver_interface
exclude: true
referenceId: solver_interface
---

<div>
{% include enable_title_numbering.html %}
</div>

<div>
{% include smart_cite/load_bib_file.html bib_file=site.data.bibliography_num_ode %}
</div>

<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_num_ode %}
</div>

<div>
{% include smart_link/load_internal_urls.html %}
</div>

## Introduction

In the previous two articles we implemented the forward and backward Euler methods for solving initial-value problems. In doing so, the codebase has grown organically, with functionality being added where necessary. While the two methods work as intended, their interfaces are not yet user friendly. There is also quite a bit of code duplication.

In this article we will address these two problems by making the code more modular. We will do this by mimicking interfaces of real-life libraries such as <smart-link linkType="ext" linkId="diffeq_home">DifferentialEquations.jl</smart-link>. The benefits will include more flexibility when calling the forward and backward Euler methods, as well as reduced code duplication. As a result of this increased flexibility, will be able to create plots that contain both the forward and backward Euler methods in one single plot, something we have not yet been able to do.

We will first cover the two problems that we are faced with in our codebase. Then, we will explore in more detail how existing interfaces work in ODE solver libraries. We will also review how we are already applying this principle when defining IVPs in our code. Finally, we implement and demonstrate the new code.

One important goal of this article is to demonstrate that code should not only be correct, but that it should also be clean. Having clean code and a clear project structure makes it easier to understand the code, to add features, and to find bugs.

## Contents

<tableOfContents></tableOfContents>

## Problem: user-friendliness

Currently, it is not possible to plot the forward and backward Euler methods together in one plot. Additionally, when invoking these two methods we have to use two different functions. Below, we have two function calls for the forward and backward Euler methods, respectively:

```julia
NumOdeTutorial.solveAndPlotForwardEuler(getStableODEProblem(), 
    [10, 20, 100, 2000], "./ForwardEulerStable.png")
NumOdeTutorial.solveAndPlotBackwardEuler(getUnstableODEProblem(), 
    [5, 10, 50, 1000], "./BackwardEulerUnstable.png")
```

Also, I designed the code such that the user specifies the number of steps instead of the step-size. In hindsight, this was not very practical. It would be better if we could specify the step-size directly.

## Problem: duplicate code

Another problem is code duplication. Code duplication occurs when there are multiple pieces of code in a codebase that are almost identical. This makes code more difficult to maintain: if a bug is discovered, then all copied pieces of that code have to be fixed as well. This duplication can usually be resolved through some abstraction mechanism, such as turning the code snippet into a function that can then be called with different arguments.

Below we can see two code snippets that are used for plotting the forward and backward Euler methods, respectively.

```julia
function solveAndPlotForwardEuler(ivp::InitialValueProblem, stepCounts::Vector{Int}, filename::String)
    for numSteps in stepCounts
        # solve for every step size and plot
        functionValues = solveForwardEuler(ivp.diffEq, y0=ivp.initialValue, t0=ivp.initialTime, tn=ivp.endTime, numSteps=numSteps)
        stepSize = (ivp.endTime - ivp.initialTime) / numSteps
        if numSteps <= 200
            plot!(functionValues, markershape = :auto, label="h=$(stepSize)", dpi=500)
        else
            plot!(functionValues, label="h=$(stepSize)", dpi=500)
        end
    end

    if ivp.exactSolution !== nothing
        # if an exact solution exists, we plot it
        plot!(ivp.exactSolution, ivp.initialTime, ivp.endTime, label="Exact solution", dpi=500)
    end
    savefig(filename)
end
```

The above code iterates over the different requested step counts, computes a trajectory, and plots it. The code below does basically the same thing, except that backward Euler is called instead of forward Euler.

```julia
function solveAndPlotBackwardEuler(ivp::InitialValueProblem, stepCounts::Vector{Int}, filename::String)
    for numSteps in stepCounts
        # solve for every step size and plot
        functionValues = solveBackwardEuler(ivp.diffEq, y0=ivp.initialValue, t0=ivp.initialTime, tn=ivp.endTime, numSteps=numSteps)
        stepSize = (ivp.endTime - ivp.initialTime) / numSteps
        if numSteps <= 200
            plot!(functionValues, markershape = :auto, label="h=$(stepSize)", dpi=500)
        else
            plot!(functionValues, label="h=$(stepSize)", dpi=500)
        end
    end

    if ivp.exactSolution !== nothing
        # if an exact solution exists, we plot it
        plot!(ivp.exactSolution, ivp.initialTime, ivp.endTime, label="Exact solution", dpi=500)
    end
    savefig(filename)
end
```

Additionally, note that both of these functions only plot the trajectories for one single algorithm. Therefore, it is currently not possible to compare the behaviour of two different algorithms in one plot.

## Idea: solver interfaces

There are existing Julia packages, such as <smart-link linkType="ext" linkId="diffeq_home">DifferentialEquations.jl</smart-link>, that provide a number of different ODE solvers. In order to make these solvers easy-to-use, the developers of that package designed an easy-to-use interface.

In the code snippet below, we can see that an IVP is defined by calling `ODEProblem`. This IVP consists of an ODE $f(y,t) = 1.01 y$ and an initial condition of $y(0) = \frac{1}{2}$. The time range is also specified such that $t \in [0, 1]$. The solver algorithm is retrieved by calling `Tsit5()`, which is a Runge-Kutta method <smart-cite bibId="tsit2011_solver"></smart-cite>. The IVP and the solver are then passed to the `solve` function, which returns the actual trajectory.

```julia
using DifferentialEquations
f(u, p, t) = 1.01 * u
u0 = 1 / 2
tspan = (0.0, 1.0)
prob = ODEProblem(f, u0, tspan)
sol = solve(prob, Tsit5(), reltol = 1e-8, abstol = 1e-8)
```

In our implementation we will do something similar, but different. The functionality of the DifferentialEquations.jl library is very extensive. Since we are just implementing ODE solvers for fun, we will only provide the basic functionalities that we need. To see what functionality is needed, let us take a look at the existing call to the solver:

```julia
solveAndPlotForwardEuler(getFlameODE(0.04), [10, 20, 100, 2000], "./ForwardEulerStable.png")
```

We can see we will need to
1. specify the IVP,
2. specify the solver with different step-sizes, and
3. provide a filename to store the plot in PNG format.

To do this, we will implement a function `solveAndPlot` that takes an IVP, a solver method, and a filename to store the plot:
```julia
solveAndPlot(ivp=getFlameODE(0.04), solvers=[ForwardEuler(0.2), ForwardEuler(0.1), ForwardEuler(0.01)], filename="./SomeFileName.png")
```

The function `ForwardEuler(h)` will retrieve the forward Euler solver with step size $h$. Additionally, we want to use multiple solvers in a single plot. Also note the usage of keyword arguments, which prevents the programmer from making mistakes when calling our library.

Also note that it should be possible to pass different solvers at the same time:
```julia
solveAndPlot(ivp=getFlameODE(0.04), solvers=[ForwardEuler(0.1), BackwardEuler(0.1)], filename="./SomeFileName.png")
```

## Recap: ODELib

Before we can implement this concept in our project, we first have to think how to actually do this. Note that in the previous article we introduced a way to more easily pass around IVPs in our code. We did this by implementing a struct called `InitialValueProblem`:

```julia
struct InitialValueProblem
    diffEq::Function
    initialValue::Float64
    initialTime::Float64
    endTime::Float64
    exactSolution::Union{Function, Nothing}
end
```

In order to actually implement an initial-value problem, we create a function that instantiates the struct with some values and returns it:
```julia
function getStableODEProblem()::InitialValueProblem
    ode(t, y) = -y - sin(t) + cos(t)
    return InitialValueProblem(
        ode,
        1.0,  # y0
        0.0,  # t0
        10.0, # end time
        cos   # exact solution
    )
end
```

Additionally, we can also pass hyperparameters for our IVP as follows:

```julia
function getStiffODEProblemFlame(init::Float64)::InitialValueProblem
    ode(t, y) = y^2 - y^3
    init = 0.01
    return InitialValueProblem(
        ode,
        init, # x0
        0.0, # t0
        2.0 / init, # tf
        nothing
    )
end
```

## Implementation

We begin by first defining the `IVPSolver` struct that contains a reference to the solver function and the name of the solver. The latter is useful when plotting the resulting trajectories.

```julia
struct IVPSolver
    solver::Function  # function that accepts a single argument of the type InitialValueProblem
    name::String
end
```

In order to actually instantiate this struct, we pass a function that takes an IVP and returns a trajectory, as well as the name of the solver.

```julia
function ForwardEuler(stepSize::Float64)::IVPSolver
    return IVPSolver(
        ivp -> solveForwardEuler(ivp=ivp, stepSize=stepSize),
        "FE h=$(stepSize)"
    )
end
```

In the code snippet above we can see a lambda function `ivp -> solveForwardEuler(ivp=ivp, stepSize=stepSize)` that takes an IVP and returns a trajectory. Also note the usage of the string interpolation operator `$(...)` that takes the value `stepSize` and puts in inside the string.

We now need to create a function that takes an IVP and different solvers and plots them all in one plot.
```julia
function solveAndPlot(;ivp::InitialValueProblem, solvers::Array{IVPSolver}, filename::String)
    # plot for each solver
    for solver in solvers
        functionValues = solver.solver(ivp)

        if length(functionValues) <= 100
            plot!(functionValues, markershape = :auto, label=solver.name, dpi=500, title=ivp.name)
        else
            # plot no markers if there are too many points
            plot!(functionValues, markershape = :none, label=solver.name, dpi=500, title=ivp.name)
        end
    end

    if ivp.exactSolution !== nothing
        # if an exact solution exists, we plot it
        plot!(ivp.exactSolution, ivp.initialTime, ivp.endTime, label="Exact solution", dpi=500)
    end
    savefig(filename)
end
```

The function above is very similar to our original `solveAndPlotForwardEuler`. It goes over all the solvers, computes a trajectory, and plots that trajectory. The label for the plotting is retrieved from the `IVPSolver` object, making it easy to know which algorithm produced which trajectory. Additionally, if an exact solution to the IVP is present, then it is plotted as well. The different solvers are passed to the function as an `Array` of `IVPSolver` objects. The `;` in the function signature enforces that all arguments are passed as keyword arguments. This is very useful to prevent coding mistakes. Also note that the `InitialValueProblem` objects now have a `name` attribute that specifies the human-readable name of the intial-value problem.

## Demonstration

Now that we have finished writing our code, we want to see it in action. The interfaces that are more easy-to-use and the reduced code duplication can only be seen when reading and writing the code. However, it is now also possible to put different ODE solvers in the same plot, and this is something we can demonstrate visually.

As a demonstration we will use the following IVP from a previous article:

$$
\begin{align*}
y'(t) &= 50(\cos(t) - y)\\
y(0) &= 0.
\end{align*}
$$

In the previous article we saw that the forward and backward Euler methods performed differently on this IVP, even for different step-sizes. We will now use our new solver and plotting interface to compare both methods in the same plot.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="comparison">
            <img src="/assets/images/num_ode/CompareForwardBackwardEuler.png">
            <figcaption>Comparison.</figcaption>
        </figure>
    </div>
</div>

As can be seen in the figure above, backward Euler produces more reasonable trajectories while forward Euler shows some oscilliatory behaviour.

## Conclusions


We first identified two problems in the code: difficult to use interfaces and code duplication. We then looked at the interfaces provided by existing ODE solvers, such as <smart-link linkType="ext" linkId="diffeq_home">DifferentialEquations.jl</smart-link>, for inspiration. We looked at our existing `ODELib.jl` code to see how such interfaces can be implemented, and then we refactored the rest of the code. We then demonstrated this new solver interface by comparing the forward and backward Euler methods in one single plot, something that was not possible previously.

In the future we will be implementing more ODE solvers. Therefore, this refactoring and clean-up of the existing code will come in handy. This article has been more focussed on the software engineering aspect of our project, while the previous articles were about the numerical methods side of the story. 

I hope that by reading this article it becomes clear that one should not only focus on the functionality of the code and the mathematical correctness, but also spend time writing clean and clear code.

## References

<bibliography>
</bibliography>
