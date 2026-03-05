---
layout: page
title: Systems of ODEs
permalink: /posts/num_ode/ode_system
exclude: true
referenceId: ode_system
---

<div>
{% include enable_image_zoom.html %}
</div>


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

<warning-box>
In this article we will be implementing a numerical ODE solver by hand. Note that this is purely for educational purposes. When doing practical work, always make sure to use existing libraries (e.g., GNU Scientific Library in C, odeint for C++, MATLAB, SciPy for Python, DifferentialEquations.jl for Julia, ODEPACK for FORTRAN). Since those libraries are widely used, they are also well tested and optimised and thus safe to use. 
</warning-box>


## Introduction

In the previous articles we explored initial value problems where both the ODE and the solutions are scalar functions. That is, the derivative given by the ODE and the function value of the solution both consist of a single real number. Such a scalar IVP allows us to model single quantities. For example, we saw an ODE that modelled the size of a single population.

Many real-world phenomena are more complex, however. Take for example models that describe
- interactions between species in an ecosystem <smart-cite bibId="wiki_lv"></smart-cite>, 
- the exchange of CO2 between different parts of the ecosystem <smart-cite bibId="sierra_climate_carbon_model"></smart-cite>, 
- the evolution of infected, vaccinated, and recovered people during an epidemic <smart-cite bibId="wiki_compartmental_model"></smart-cite>,
- the evolution of voltage, current, and charge of different electrical components <smart-cite bibId="rlc_ode_libretexts"></smart-cite>.

Even a simple dynamical system that describes the trajectory of a single particle or a single planet has to model two different real-valued quantities $(x,y)$ at the same time <smart-cite bibId="wiki_two_body_problem"></smart-cite>.

In order to model multiple (interacting) quantities using ODEs we will use so-called <em>systems</em> of ODEs. Where a single ODE models the change of a single variable, a system of ODEs models how a vector of values changes as time passes. As a result, the solution of a system of ODEs is also a vector valued function, the derivatives are vectors, etc. Each component of those vectors says something about one single component of the system that we are modelling.

In this article we will focus on lifting the single-dimensional concepts we have learned previously to multiple dimensions. We will first formalise this a bit by explaining what a vector valued function is and how we can differentiate and integrate such functions. Once we have lifted the basic tools of calculus to the multi-dimensional world, we can start thinking about multi-dimensional systems of ODEs. Finally, we will also implement these concepts in Julia so we can solve systems of ODEs numerically.

## Overview

<tableOfContents></tableOfContents>

## Vector valued functions

Before introducing systems of ODEs, we first have to make sense of a vector valued function. That is, how do we define a function $y$ that maps a real number $t \in \mathbb{R}$ to a vector $\vec{v} \in \mathbb{R}^n$ of real numbers?

### Recap: real-valued functions

We will begin by recalling univariate real-valued functions $y: \mathbb{R} \to \mathbb{R}$ that map a real number $t \in \mathbb{R}$ onto a value $y(t) \in \mathbb{R}$.

For such functions we can consider the derivative $y'(t) = \frac{df}{dt}(t)$ which describes the rate at which $y(t)$ changes as $t$ changes. Note that the derivative $y'$ of such a function $y$ is then once again a real-valued univariate function. On the other hand there is also the integral $\int y(\tau)\,d\tau$, which has the opposite effect of differentiation.

One key property here is the **fundamental theorem of calculus** <smart-cite bibId="wiki_fundamental_thm_calc"></smart-cite>: given the value of $y$ at a specific point $t_0$ and the derivative $y'(t)$ we can re-construct the original function:

$$
y(t) = y(t_0) + \int_{t_0}^{t} y'(\tau)\, d\tau.
$$

### Calculus in higher dimensions

We will now see that this fundamental theorem also exists for vector valued functions. First, we define our function to be a vector $\vec{y}$ of real-to-real functions $y_i: \mathbb{R} \to \mathbb{R}$:

$$
\vec{y}(t) = \left[ \begin{array}{c}
y_1(t) \\
y_2(t) \\
\vdots \\
y_n(t) \\
\end{array} \right]
$$

#### Derivatives

Just like in the real-valued case, we will define derivatives and integrals. Since our function is vector valued, the function value has multiple dimensions. The derivative indicates how fast the function value changes and thus has a rate-of-change for every dimension of the vector. Formally:

$$
\frac{d\vec{y}}{dt}(t) = \left[ \begin{array}{c}
\frac{dy_1}{dt}(t) \\
\frac{dy_2}{dt}(t) \\
\vdots \\
\frac{dy_n}{dt}(t) \\
\end{array} \right]
$$

Alternatively, we can motivate such an elementwise definition of the derivative by using limits:

$$
\vec{f}'(t) = \lim_{h \to 0} \frac{\vec{f}(t + h) - \vec{f}(t)}{h}.
$$

Since the expression above consists of subtracting vectors and dividing by a scalar, we are just doing elementwise operations on vectors.

Such "elementwise operations on vectors" is what we call vector arithmetic. Let $\vec{a} = [a_1 \dots a_n]^T$ and $\vec{b} = [b_1 \dots b_n]^T$ be two vectors in $\mathbb{R}^n$ and let $c \in \mathbb{R}$ be a real number. We can then define the following two arithmetic operations:



$$
\vec{a} + \vec{b} = \left[ \begin{array}{c}
a_1 + b_1 \\
a_2 + b_2 \\
\vdots \\
a_n + b_n \\
\end{array} \right]\quad c \cdot \vec{a} = \left[ \begin{array}{c}
c \cdot a_1 \\
c \cdot a_2 \\
\vdots \\
c \cdot a_n \\
\end{array} \right]
$$

#### Integrals

Similarly, the integral can be defined for every element of the vector:

$$
\int \vec{y}(t) \,dt = \left[ \begin{array}{c}
\int y_1(t) \,dt \\
\int y_2(t) \,dt \\
\vdots \\
\int y_n(t) \,dt \\
\end{array} \right]
$$

Once again, we can find a deeper motivation. If we assume that Riemann-integrals are sufficient, then the integral can be defined as:

$$ \int_{t_0}^{t} \vec{f}(\tau)\,d\tau = \lim_{n \to \infty} \sum_{i=0}^{n-1} \vec{f}\left(t_i \right) \Delta t,$$

where $\Delta t = \frac{t - t_0}{n}$ and $t_i = t_0 + i \cdot \Delta t$.

From this definition we can clearly see we are just adding vectors and multiplying them by scalars. These are once again elementwise operations.

#### Fundamental theorem of calculus

We can now apply the **fundamental theorem of calculus** to take integrate the derivate $\vec{y}'(t)$ of a function $\vec{y}$ and get back the original function $\vec{y}$:

$$
\vec{y}(t) = \vec{y}(t_0) + \int_{t_0}^{t} \vec{y}'(\tau)\, d\tau
$$

If we write this out in detail, for every dimension, then we get the following:

$$
\vec{y}(t) = \left[ \begin{array}{c}
y_1(t_0) \\
y_2(t_0) \\
\vdots \\
y_n(t_0) 
\end{array} \right] + \left[ \begin{array}{c}
\int_{t_0}^{t} y'_1(\tau)\, d\tau \\
\int_{t_0}^{t} y'_2(\tau)\, d\tau \\
\vdots \\
\int_{t_0}^{t} y'_n(\tau)\, d\tau \\
\end{array} \right]
$$





## Systems of ODEs

Now that we have discovered how to apply differentiation and integration to vector valued functions, we will use these to make sense of systems of ODEs.

### Recap: single-dimension ODEs

We will first recall what single-dimension ODEs are about. In the previous articles, we have often discussed how to solve so-called initial value problems. Such problems can be formally defined as follows:

<definition>
<envName>Initial value problem</envName>
<p>An initial value problem (IVP) consists of an ODE

$$
\frac{dy}{dt}(t) = f(t, y(t)),
$$

and an <em>initial condition</em> $y_0$ at time $t_0$.</p>

<p>The <em>solution</em> of an IVP is a function $y$ such that $y(t_0) = y_0$ and $y'(t) = f(t, y(t))$ for all $t$. </p>

<p>Note that $f: \mathbb{R} \times \mathbb{R} \to \mathbb{R}$ maps a time value $t$ and a function value $y \in \mathbb{R}$ onto the derivative $y'(t) \in \mathbb{R}$.</p>
</definition>

The idea here is that we want to re-construct the function $y(t)$ using only the derivative $y'(t)$ (given by $f(t,y)$) and the function value $y(t_0)$ at some point $t_0$.

The solution $y$ of the IVP will then be 

$$
\begin{align*}
y(t) &= y(t_0) + \int_{t_0}^t y'(\tau)\,d\tau \\
 &= y(t_0) + \int_{t_0}^t f(\tau, y(\tau))\,d\tau.
\end{align*}
$$

Note that this is essentially just the **fundamental theorem of calculus** that we talked about earlier.


<example>
    <envName>Logistic equation, from <smart-cite bibId="wiki_logistic_equation"></smart-cite></envName>

<p>We will consider the logistic equation as an example of a single-dimensional ODE. Even though a closed-form solution is rather straightforward, we will make use of an ODE instead:
$$
\begin{align*}
y'(t) &= r \cdot y(t) \cdot \left(1-\frac{y(t)}{K}\right), \\
y(0)  &= P_0.
\end{align*}
$$
</p>

<p>This IVP describes the evolution of the size of a single species in an ecosystem. The value $P_0$ is the initial size of the population</p>

<p>Additionally, the logistic equation has the following two parameters:
    <ul>
        <li>$r$: the growth rate of the population,</li>
        <li>$K$: the maximum population that the ecosystem can sustain.</li>
    </ul>
</p>
</example>

### Vector valued ODEs

In the previous section, we considered an ODE that models the size of a population of a single species of animals. But what if want to model two species and their interactions at the same time? In that case we need a system of ODEs. The solution of such a system is a vector valued function $\vec{y}: \mathbb{R} \to \mathbb{R}^n$ that maps a time value $t$ onto a vector $\vec{y}(t)$.

<example>
<envName>Lotka-Volterra, from <smart-cite bibId="wiki_lv"></smart-cite></envName>

<p>A population with two species can be modelled using the Lotka-Volterra equations <smart-cite bibId="wiki_lv"></smart-cite>. Let $y_1$ be the population of species 1 and $y_2$ be the number of individuals of species 2.</p>

<p>The rate of change of the population sizes can be defined in function of the current population sizes. This gives rise to the following system of ODEs:</p>

$$
\begin{array}{rl}
y_1'(t) &= \alpha y_1 - \beta y_1 y_2, \\
y_2'(t) &= -\gamma y_2 + \delta y_1 y_2. \\
\end{array}
$$

<p>This system of ODEs has the following real-valued parameters:
<ul>
    <li>$\alpha$: reproduction rate of the prey population,</li>
    <li>$\beta$: rate at which the predators hunt and eat the prey,</li>
    <li>$\gamma$: natural mortality rate of the predators,</li>
    <li>$\delta$: growth rate of the predator population, relative to the prey population.</li>
</ul>
</p>

<p>We can combine this with an initial population size $\vec{y}(0) \in \mathbb{R}^2$ to obtain an initial value problem with a unique solution.</p>

<p>We can thus write that $\vec{y}'(t) = \vec{f}(t, \vec{y}(t))$ where $\vec{f}: \mathbb{R} \times \mathbb{R}^2 \to \mathbb{R}^2$ is the ODE that maps a time value $t$ and a function value $\vec{y}(t) = [y_1(t), y_2(t)]^T$ onto the derivative in both dimensions $\vec{y}'(t) = [y_1'(t), y_2'(t)] ^T$.</p>

Note $\vec{f}$ is also a vector of functions such that $\vec{f} = [f_1, f_2]^T$ and

$$
\begin{array}{rll}
y_1'(t) &= f_1(t, y_1, y_2) &= \alpha y_1 - \beta y_1 y_2, \\
y_2'(t) &= f_2(t, y_1, y_2) &= -\gamma y_2 + \delta y_1 y_2. \\
\end{array}
$$
</example>

We can now generalise this two-dimensional example to $n$ dimensions. 

<definition>
<envName>Initial value problem</envName>
<p>An initial value problem (IVP) consists of an ODE

$$
\frac{d\vec{y}}{dt}(t) = \vec{f}(t, \vec{y}(t)),
$$

and an <em>initial condition</em> $\vec{y_0}$ at time $t_0$.</p>

<p>The <em>solution</em> of an IVP is a function $\vec{y}(t)$ such that $\vec{y}(t_0) = \vec{y_0}$ and $\vec{y}'(t) = \vec{f}(t, \vec{y}(t))$ for all $t$. </p>

<p>Note that $\vec{f}: \mathbb{R} \times \mathbb{R}^n \to \mathbb{R}$ maps a time value $t$ and a function value $\vec{y}(t) \in \mathbb{R}^n$ onto the derivative $\vec{y}'(t) \in \mathbb{R}^n$, with $n > 0$</p>
</definition>

We can once again find a solution using the fundamental theorem of calculus for vector valued functions:

$$
\begin{align*}
\vec{y}(t) &= \vec{y}(t_0) + \int_{t_0}^t \vec{y}'(\tau)\,d\tau \\
 &= \vec{y}(t_0) + \int_{t_0}^t \vec{f}(\tau, \vec{y}(\tau))\,d\tau.
\end{align*}
$$


Finally, note that if the different functions $f_i$ only depend on $t$ and $y_i(t)$, then we have $n$ uncoupled ODEs. Each such ODE is a one-dimensional ODE that can be solved on its own. Therefore, the theory of systems of ODEs is not needed for them. Coupled ODEs, on the other hand, depend on multiple dimensions at the same time. Such coupled ODEs have to be solved together.

## Numerically solving systems of ODEs

Now that we have a better understanding of the theory behind systems of ODEs, we can start translating these concepts into a simple implementation.

We will first conceptualise how to build a solver for systems of ODEs, as opposed to single ODEs. Later, we will go through all of our previously implemented solvers and modify them to support systems of ODEs.

We will start by modifying the forward Euler method to support systems of ODEs. Consider the following forward Euler implementation for a single ODE.

```julia
function solveForwardEuler(;
    ivp::InitialValueProblem, 
    stepSize::Float64
)::Vector{Tuple{Float64,Float64}}

    # set some values
    currentVal::Float64 = ivp.initialValue
    currentTime::Float64 = ivp.initialTime

    # add initial condition to the list of output values
    funcVals = [(currentTime, currentVal)]

    while (currentTime + stepSize) <= ivp.endTime
        # apply forward Euler method formula y_i+1 = y_i + h * f(t_i, y_)
        currentVal = currentVal + stepSize * ivp.diffEq(currentTime, currentVal)

        # increase time from t_i to t_i+1
        currentTime += stepSize

        # store value (t_i+1, y_i+1)
        push!(funcVals, (currentTime, currentVal))
    end
    
    return funcVals
end
```

This implementation has the following important problems:
- the `currentValue` is a `Float64` and can therefore only handle single values instead of vectors of values.
- The return value is a list of tuples $(t, y)$ where $y$ is a single float instead of a vector.
- The initial value of the IVP contained in `ivp.initialValue` is also a `Float64`, while the initial value of a system of ODEs is a vector.


We will start by considering the return value. For example, let's say that the algorithm is used to simulate a population of animals in an ecosystem and returns the following object:
```julia
[(0.0, 20.0), (1.0, 23.0), (2.0, 25.0), ...]
```

Then this means that at time 0 there were 20 animals in the population, after 1 day there were 23, after two days 25 animals, etc. Since we are only modelling one species, we only need to store one time value and one function value to indicate the number of animals. 

But what if we were to model two species at the same time? The algorithm might then return the following to indicate the sizes of the two animal populations at every time point:
```julia
[(0.0, [20.0, 15.0]), (1.0, [35.0, 16.0]), (2.0, [60.0, 23.0]), ...]
```

As you can see, for every time-step we now no longer have floats but rather vectors of floats! Such an object has the following type:
```julia
Vector{Tuple{Float64,Vector{Float64}}}
```

This means that we have an outer vector, with one entry for every timestep. Each entry is a tuple with two elements: the time value and a vector indicating the number of animals. Each entry of the vector is then a float for each specific species of animals.

If this sounds rather complicated, then that is because we are making it too complicated! When dealing with nested data structures, it is often a good idea to define custom types. The benefit is that both the custom type and its attributes can be given human-readable names, making it easier to understand what is going on.

We therefore create the following struct:
```julia
const FunctionValue = Vector{Float64}

struct IVPSolution
    timeValues::Vector{Float64}
    trajectory::Vector{FunctionValue}  # trajectory of function values
end
```
This has a vector `timeValues` of time values, one for every step. Additionally, there is a vector `trajectory` of function values: the outer vector has one entry for every time-step. Each entry is a vector with one component for each ODE in our system.

If we now replace the return type with `IVPSolution` and indicate that the `currentVal` is a vector of floats, we get the following:
```julia
function solveForwardEuler(;
    ivp::InitialValueProblem, 
    stepSize::Float64
)::IVPSolution

    # set some values
    currentVal::Vector{Float64} = ivp.initialValue
    currentTime::Float64 = ivp.initialTime

    # add initial condition to the list of output values
    solution = IVPSolution([currentTime], [currentVal])

    while (currentTime + stepSize) <= ivp.endTime
        # apply forward Euler method formula y_i+1 = y_i + h * f(t_i, y_)
        currentVal = currentVal + stepSize * ivp.diffEq(currentTime, currentVal)

        # increase time from t_i to t_i+1
        currentTime += stepSize

        # store value (t_i+1, y_i+1)
        push!(solution.timeValues, currentTime)
        push!(solution.trajectory, currentVal)

    end
    
    return solution
end
```

The only thing that still needs be changed is the `InitialValueProblem` struct, to indicate that the initial value is also a vector of floats:


```julia
struct InitialValueProblem
    name::String
    diffEq::Function
    # initialValue::Float64  OLD
    initialValue::Vector{Float64}  # NEW
    initialTime::Float64
    endTime::Float64
    exactSolution::Union{Function, Nothing}
end
```

We will now apply this principle of replacing `Float64` with `Vector{Float64}` throughout our code base.


## Modifying existing solvers

In this section we will go through all of the existing solver algorithms and make the necessary modifications. In the previous articles, we have implemented the following techniques:
- Forward Euler
- Backward Euler
- Runge-Kutta
- Adaptive-step Runge-Kutta

The forward Euler algorithm is more or less already covered by the previous section. For the backward Euler algorithm, we need to figure out how to solve the non-linear equations when those equations contain vector valued variables. For Runge-Kutta we have successive linear approximations that now need to be generalised using vectors instead of real values. Finally, for the adaptive-step technique, we need to perform the error computation on vectors instead of scalar real values.

### Runge-Kutta for systems of ODEs

Up until now we have only considered Runge-Kutta solvers for one-dimensional ODEs. It is possible to use the same Runge-Kutta methods for systems of ODEs. To do so, we replace the operations on scalars with operations on vectors.

<definition envId="rk_general">
<envName>Explicit Runge-Kutta method with $n$ stages, from <smart-cite bibId="wiki_runge_kutta"></smart-cite></envName>
<p>Given are an ODE $\vec{y'}(t) = \vec{f}(t, \vec{y}(t))$ and an initial condition $\vec{y}(t_0) = \vec{y_0}$, which together make up an initial value problem. We assume $\vec{f}(t, \vec{y})$ to be Lipschitz-continuous in $\vec{y}$. Additionally, we select a sufficiently small step size $h$.</p>

<p>
Using an iterative scheme defined as

$$
\vec{y_{i+1}} = \vec{y_i} + h \sum_{s=1}^n b_s \vec{k_s},
$$ 

we can approximate the unique solution $\vec{y}(t)$ of the IVP with values $\vec{y_i} \approx \vec{y}(t_i)$ and $t_i = t_0 + ih$.
Here, $n \in \mathbb{N}$ is the number of stages of the Runge-Kutta method and $\vec{b} \in \mathbb{R}^n$ is a vector.
</p>

<p>
The values $\vec{k_s}$ for $s \in \{1, \dots, n\}$ are given by

$$
	\vec{k_{s}} = \vec{f}\left(t_i + c_s h, y_i + h\sum_{j=1}^{s-1} a_{sj}\vec{k_{j}}\right),
$$

where $\vec{c} \in \mathbb{R}^n$ is a vector with $c_0=0$, and $[a_{ij}] \in \mathbb{R}^{n \times n}$ is a (strictly lower-triangular) matrix.
</p>
</definition>

Previously, we used scalar values $k_j$ for intermediate approximations of the value of the ODE. Since the derivatives are now vectors, we have to start using vectors $\vec{k_j}$. This is because systems of ODEs have vector-valued solutions. Note that all operations used above (multiplication, addition) work on scalars as well as vectors.

When applying the Runge-Kutta technique, we need to compute $\vec{k_s}$ based on $\vec{k_1}, \dots, \vec{k_{s-1}}$:

$$
\vec{k_{s}} = \vec{f}\left(t_i + c_s h, y_i + h\sum_{j=1}^{s-1} a_{sj}\vec{k_{j}}\right).
$$

This also means that we are performing these computations for all dimensions simultaneously: we first compute $\vec{k_1}$ for all dimensions, then $\vec{k_2}$, etc. To motivate this, informally, we can draw an interesting analogy with the integral-formulation of the solution:

$$
\begin{align*}
\vec{y}(t) &= \vec{y}(t_0) + \int_{t_0}^t \vec{y}'(\tau)\,d\tau \\
 &= \vec{y}(t_0) + \int_{t_0}^t \vec{f}(\tau, \vec{y}(\tau))\,d\tau.
\end{align*}
$$

Given that an integral "accumulates" the function values of $\vec{f}$ by slowing "iterating" $\tau$ from $t_0$ to $t$, we are doing this for all dimensions simultaneously. That is, we have integrated all dimensions up until $\tau$ at any given "step" in the "integration process". This motivates the fact that we have to compute each $\vec{k_{s}}$ for all dimensions simultaneously.


It is now time to implement this. Up until now we have stored the float-valued intermediate approximations $k_1, \dots, k_n$ in a vector `k_vals`. Since each value $k$ approximates s single derivative, we thus had a vector of floats:

```julia
k_vals::Vector{Float64} = [ivp.diffEq(currentTime, currentVal)]
```

Now, however, derivatives are vectors! So this becomes a vector of vectors:

```julia
k_vals::Vector{Vector{Float64}} = [ivp.diffEq(currentTime, currentVal)]
```

In order to compute the final function value approximation, we need to implement the following formula:

$$
\vec{y_{i+1}} = \vec{y_i} + h \sum_{s=1}^n b_s \vec{k_s}.
$$

Up until now, we had scalar values $k_s$ and in that case the sum is actually a dot-product $\vec{b} \cdot \vec{K}$, where $\vec{K} = [k_1, \dots, k_n]^T$. Therefore, it was a logical choice to use the `dot()` function:

```julia
y_val::Float64 = currentVal + stepSize * dot(a_vec, k_vals)
```

However, we now have vectors $\vec{k_s}$, and therefore the value $K = [\vec{k_1}, \dots, \vec{k_n}]^T$ is actually a matrix. The `dot()` function does not support matrix arguments, and therefore we have to use `sum()` combined with `.*` instead:


```julia
y_val::Vector{Float64} = currentVal + stepSize * sum(a_vec .* k_vals)
```

The `sum(r .* s)` expression first multiplies $\vec{r}$ and $\vec{s}$ elementwise and then sums up the resulting vector. More formally, it will compute $\sum_i r_i \cdot s_i$. Note that if $s$ is a matrix, then each $s_i$ is a vector, which is exactly what we need.


### Adaptive-step error estimation

In the article on adaptive-step Runge-Kutta methods, we used different values for the step-size $h$ at different iterations in order to keep the error below a desired error threshold. We can still do this, but we will use one single step-size for all dimensions.

Recall the formula used to adjust the step-size:

$$
h_{\mathrm{new}} = h \cdot f_{\mathrm{safe}} \cdot \max\left( q_{\mathrm{min}},  \min\left( q_{\mathrm{max}}, q \right) \right),
$$

where

$$
q = \sqrt[5]{\frac{\varepsilon}{\absLength{z_{i+1} - y_{i+1}} }}.
$$

Previously, we had scalar values $z_{i+1}$ and $y_{i+1}$, which we could subtract and take the absolute value of, resulting in an estimation of the error. Now, we will instead subtract vectors $\vec{z_{i+1}}$ and $\vec{y_{i+1}}$, which results in a vector. Since we can only take the square root of a scalar, we will need to convert this new vector into a scalar. To do this, we will take the <em>infinity-norm</em> defined as:

$$ \vecNorm{x}_\infty = \max_{i=1 \dots n} \absLength{x_i}. $$

In the single-dimension case the old and new ways of computing this error are the same: for $n=1$, this clearly is just the absolute value. This is also a conservative approach: the step-size is adjusted to the highest error across all dimensions, which causes us to remain within the allowable error margins for all dimensions simultaneously.

The old and new approaches look as follows in Julia:

```julia
errorEst = abs(higherOrderEst - lowerOrderEst)
```

```julia
errorEst = norm(higherOrderEst - lowerOrderEst, Inf)
```

Recall that `higherOrderEst` is the 5-th order Runge-Kutta approximation, while `lowerOrderEst` is 4-th order. The `abs()` function gives the absolute value, while `norm(..., Inf)` computes the infinity norm.

### Backward Euler for systems of ODEs

Special attention needs to be paid to implicit methods such as the backward Euler method. We first have to modify the definition of the backward Euler method to support vector valued functions and systems of ODEs:


<definition envId="backward_euler">
<envName>Backward Euler method</envName>
<p>Given are an ODE $\vec{y}'(t) = \vec{f}(t, \vec{y}(t))$ and an initial condition $\vec{y}(t_0) = \vec{y_0}$, which together make up an initial value problem. We assume $\vec{f}(t, \vec{y})$ to be Lipschitz-continuous in $\vec{y}$. Additionally, we select a sufficiently small step size $h$.</p>

<p>
Using an iterative scheme defined as

$$
\vec{y_{i+1}} = \vec{y_i} + h \vec{f}(t_{i+1}, \vec{y_{i+1}}),\,\text{with}\,i \in \{0, 1, \dots\},
$$ 

we can approximate the unique solution $\vec{y}(t)$ of the IVP with values $\vec{y_i} \approx \vec{y}(t_i)$ and $t_i = t_0 + ih$.
</p>
</definition>

In an earlier article we noted that the backward Euler method gives rise to the following non-linear equation, where $y_{i+1}$ appears on both sides of the equation:

$$
y_{i+1} = y_i + h f(t_{i+1}, y_{i+1}),\,\text{with}\,i \in \{0, 1, \dots\},
$$ 

In order to solve these, we used a non-linear solver. Without going into too much detail, non-linear solvers can also handle systems of non-linear equations where the values $\vec{y_{i+1}}$ are vectors instead of scalars $y_{i+1}$:

$$
\vec{y_{i+1}} = \vec{y_i} + h \vec{f}(t_{i+1}, \vec{y_{i+1}}),\,\text{with}\,i \in \{0, 1, \dots\},
$$ 

The reason why we need a solver that specifically supports <em>systems of equations</em> is because these equations might be coupled. That is, the different equations might refer to each other such that the $i$-th and $j$-th equations in a system depend on each other. This means that we cannot solve one equation without knowing the solution to the other equation. We will now illustrate this with an example:

<example>

<p>In order to demonstrate the necessity of coupled non-linear equations, we will look at a small example. Consider once again the Lotka-Volterra system of ODEs:

$$
\begin{array}{rl}
y_1'(t) &= \alpha y_1 - \beta y_1 y_2, \\
y_2'(t) &= -\gamma y_2 + \delta y_1 y_2. \\
\end{array}
$$
</p>

<p>For clarity, we will deviate from the notation used in the rest of the article. Previously, we used $y_i$ to denote the $i$-th
value produced by the solver algorithm. Instead, let $y_j^{(i)}$ be the $j$-th component of the $i$-th produced value.</p>

<p>If we plug the Lotka-Volterra equations into the definition of the backward Euler method, we get the following two non-linear equations:

$$
\begin{align*}
y_1^{(i+1)} &= y_1^{(i)} + h \left( \alpha y_1^{(i+1)} - \beta y_1^{(i+1)} y_2^{(i+1)} \right) \\
y_2^{(i+1)} &= y_2^{(i)} + h \left( -\gamma y_2^{(i+1)} + \delta y_1^{(i+1)} y_2^{(i+1)} \right)
\end{align*}
$$
</p>

<p>We can see that in order to solve the first equation we need to know the solution to the second equation and vice-versa. Therefore, we need to have a method to solve both equations simultaneously.</p>
</example>

In the following code snippet we can see the core of the backward Euler solver, as described in an an <smart-link linkType="int" linkId="forward_euler">earlier article</smart-link>.

```julia
forwardEuler(currentValue) = currentValue 
        + stepSize * diffEq(currentTime, currentValue)

# call forward Euler to get an initial estimate
u0 = forwardEuler(currentValue)

# backward Euler method formula y_i+1 = y_i + h * f(t_i+1, y_i+1)
backwardEuler(nextValue, p) = currentValue 
        + stepSize * diffEq(nextTime, nextValue) - nextValue

# solve non linear eq
problem = NonlinearProblem(backwardEuler, u0)
nextValue = solve(problem, RobustMultiNewton()).u
```

The code above will remain exactly the same, but the types of the symbols will change. The variables `u0` and `currentValue` are now of the type `Vector{Float64}` instead of `Float64`. The functions `forwardEuler()` and `backwardEuler()` therefore also have return type `Vector{Float64}` instead of `Float64`. Luckily, the `NonlinearProblem` and `solve()` from `NonlinearSolve.jl` are capable of handling that.

### Plotting

Since we want to visualise our systems of ODEs, we will have to come up with a way to plot these. Up until now, we have only plotted single-dimensional curves where $y(t)$ is the vertical axis and $t$ is the horizontal axis. Since $\vec{y}(t)$ is now a vector, we will have to plot multiple curves, one for each dimension of the ODE.

To do this, we will now have two different plotting utilities:
- `solveAndPlotSystem` which plots all the dimensions of a system of ODEs produced by a single solver, and
- `plotAndCompareSolvers` which plots a single dimension of a system produced by multiple different solvers.

In a <smart-link linkId="solver_interface" linkType="int">previous article</smart-link> we have already written code to plot the trajectories obtained by solving initial value problems. Such trajectories consisted of a sequence $y_0, \dots, y_n$ of scalar function values and a sequence $t_0, \dots, t_n$ of time values.

Now, however, we have a sequence $\vec{y_0}, \dots, \vec{y_n}$ of of vectors. In order to plot the $k$-th dimension, we just have to extract a sequence that consists of the $k$-th dimension of each vector $\vec{y_i}$. This is then a sequence of scalar values that can be plotted using the old plotting code.

## Demonstration

In the earlier sections we have talked about two different population models: the logistic equation for a single species, and the Lotka-Volterra model for two species. We will use these to demonstrate our implementation.

### Lotka-Volterra

The Lotka-Volterra model is a two-dimensional model, resulting in various vectors of size two.

```julia
function getLotkaVolterraODE(;
    alpha::Float64,
    beta::Float64,
    gamma::Float64,
    delta::Float64,
    initPreyDensity::Float64,
    initPredatorDensity::Float64
)::InitialValueProblem
    ode(t, y) = [
        y[1]*(alpha - beta * y[2]),
        y[2]*(-gamma + delta * y[1])
    ]
    return InitialValueProblem(
        "Lotka-Volterra (alpha=$(alpha), beta=$(beta), \n gamma=$(gamma), delta=$(delta))",
        ode,
        [initPreyDensity, initPredatorDensity], # y0
        0.0, # t0
        100.0, # tf
        nothing,
        ["Prey density", "Predator Density"]
    ) 
end
```

We can see that the ODE now maps a time value `t` and an array `y` of length two onto another array of length two. We also pass two initial values instead of one. Finally, we pass an array of strings `["Prey density", "Predator Density"]` with each entry being the label of that specific dimension of the ODE. This system of ODEs also has a few parameters that the caller will have to provide together with the initial values:
- `alpha`: reproduction rate of the prey population,
- `beta`: rate at which the predators hunt and eat the prey,
- `gamma`: natural mortality rate of the predators,
- `delta`: growth rate of the predator population, relative to the prey population,
- `initPreyDensity`: the initial prey population size,
- `initPredatorDensity`: the initial predator population size.

Using our newly written code, we can solve the Lotka-Volterra system with the following code:
```julia
# construct the IVP
ivp = getLotkaVolterraODE(
    alpha=0.1,
    beta=0.02,
    gamma=0.4,
    delta=0.02,
    initPreyDensity=10.0,
    initPredatorDensity=10.0
)

# initialise the solver
solver = RKF45(
    atol=1e-5, 
    initStepSize=5e-2,
    minStepSize=0.00001,
    maxStepSize=1.0,
    minStepScale=0.1,
    maxStepScale=4.0,
)

# use the solver to solve the IVP and plot the results
NumOdeTutorial.solveAndPlotSystem(ivp=ivp, solver=solver, 
    filenamePrefix="lotkaVolterraExperiment")
```

We will consider the following parameter values:
- $\alpha=1.1, \beta=0.4, \gamma=0.4, \delta=0.1$ <smart-cite bibId="wiki_lv"></smart-cite>,
- $\alpha=0.1, \beta=0.02, \gamma=0.4, \delta=0.02$ <smart-cite bibId="lv_param_modelica"></smart-cite>.

After the IVPs are solved and plotted, we obtain the following results:

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveLotkaVolterraA_traj">
            <figureImage imgSrc="/assets/images/num_ode/ode_sys/rungeKuttaAdaptiveLotkaVolterraA_traj.png"></figureImage>
            <figcaption>Population sizes ($\alpha=1.1, \beta=0.4, \gamma=0.4, \delta=0.1$)</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveLotkaVolterraB_traj">
            <figureImage imgSrc="/assets/images/num_ode/ode_sys/rungeKuttaAdaptiveLotkaVolterraB_traj.png"></figureImage>
            <figcaption>Population sizes ($\alpha=0.1, \beta=0.02, \gamma=0.4, \delta=0.02$)</figcaption>
        </figure>
    </div>
</div>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveLotkaVolterraA_steps">
            <figureImage imgSrc="/assets/images/num_ode/ode_sys/rungeKuttaAdaptiveLotkaVolterraA_steps.png"></figureImage>
            <figcaption>Step sizes ($\alpha=1.1, \beta=0.4, \gamma=0.4, \delta=0.1$)</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveLotkaVolterraB_steps">
            <figureImage imgSrc="/assets/images/num_ode/ode_sys/rungeKuttaAdaptiveLotkaVolterraB_steps.png"></figureImage>
            <figcaption>Step sizes ($\alpha=0.1, \beta=0.02, \gamma=0.4, \delta=0.02$)</figcaption>
        </figure>
    </div>
</div>

The original sources for the parameter values that we used here also contain plots and they look identical to the plots we produced ourselves. I did not copy those plots here, but you can find them on the respective websites (see: <smart-cite bibId="wiki_lv"></smart-cite> and <smart-cite bibId="lv_param_modelica"></smart-cite>).

In <smart-ref targetId="rungeKuttaAdaptiveLotkaVolterraA_traj" targetType="fig"></smart-ref> and <smart-ref targetId="rungeKuttaAdaptiveLotkaVolterraB_traj" targetType="fig"></smart-ref> at the top, we can see how the sizes of the prey and predator populations evolve. Both simulations seem to exhibit the same dynamic: the predators need prey to survive, and the presence of predators causes the prey population to decrease. We can see this by comparing the curves. 

If the prey are present in large quantities, then the amount of predators goes up. When there are a lot of predators, the amount of prey decreases. Due to the lack of prey, the predators begin to decrease in numbers. This then causes the prey population to grow in the absence of predators. This cycle repeats itself.

In <smart-ref targetId="rungeKuttaAdaptiveLotkaVolterraA_steps" targetType="fig"></smart-ref> and <smart-ref targetId="rungeKuttaAdaptiveLotkaVolterraB_steps" targetType="fig"></smart-ref> we can see how the step-sizes evolve.

### Logistic equation

In the <smart-link linkId="adaptive_rk" linkType="int">previous article</smart-link>, we have already implemented the logistic equation <smart-cite bibId="wiki_logistic_equation"></smart-cite> to model single-species populations. However, we now have to adapt it since our solver expects systems of ODEs. Since the logistic equation is single-dimensional, we will implement it using vectors of size one.

```julia
function getLogisticODE(;
    initPop::Float64,
    capacity::Float64,
    growthRate::Float64
)

    p0 = initPop  # initial population
    k = capacity  # max population
    r = growthRate  # growth rate

    ode(t, y) = [r*y[1]*(1-(y[1]/k))]
    exact(t) = [(p0*k*exp(r*t))/((k-p0) + p0*exp(r*t))]
    return InitialValueProblem(
        "Logistic ODE (p0=$(p0), \n k=$(k), r=$(r))",
        ode,
        [p0], # y0
        0.0, # t0
        100.0, # tf
        exact,
        ["Population"]
    ) 
end
```

As you can see above, we are passing vectors of size one all the time. This is the case for the ODE, the initial value, and the exact solution which is now also vector valued. Finally, note that we are now also passing an array of string labels `["Population"]` to label the plotted curve. Other than that, the code remains the same. 

Recall that the parameters have the following meaning:
- `initPop`: the population size at the start of the simulation,
- `capacity`: the maximum population size supported by the ecosystem,
- `growthRate`: the rate at which the population grows.

If we solve and plot the IVP, we obtain the same result as in the previous article:

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveLogistic_traj">
            <figureImage imgSrc="/assets/images/num_ode/ode_sys/rungeKuttaAdaptiveLogistic_traj.png"></figureImage>
            <figcaption>The population size.</figcaption>
        </figure>
    </div>
</div>

The resulting curve is very simple. It starts at the initial population size and then increases until the maximum capacity is reached.

## Conclusion

In this article we extended our ODE solver algorithms to support systems of ODEs instead of just single ODEs. We first investigate what such systems look like and formalised them using vector valued functions that map a real number onto a vector. Then, we lifted concepts such as integration from single-variable calculus to multi-variable calculus in order to solve such systems of ODEs. 

With those concepts in mind, we modified all the existing algorithms in the code base to support systems of ODEs. This mostly involved replacing the `Float64` data type with the `Vector{Float64}` data type. Finally, we demonstrated our new algorithms on two examples: the logistic equation and the Lotka-Volterra model.

Now that we have introduced systems of ODEs, I am also interested in investigating the theory behind them such as Picard's theorem, Taylor series, and error bounds in multiple dimensions. Stay tuned!


## References

<bibliography>
</bibliography>
