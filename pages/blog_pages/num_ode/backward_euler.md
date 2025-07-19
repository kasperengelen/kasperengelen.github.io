---
layout: page
title: Backward Euler method
permalink: /posts/num_ode/backward_euler
exclude: true
referenceId: backward_euler
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

<warning-box>
In this article we will be implementing a numerical ODE solver by hand. Note that this is purely for educational purposes. When doing practical work, always make sure to use existing libraries (e.g., GNU Scientific Library in C, odeint for C++, MATLAB, SciPy for Python, DifferentialEquations.jl for Julia, ODEPACK for FORTRAN). Since those libraries are widely used, they are also well tested and optimised and thus safe to use. 
</warning-box>

## Introduction

Differential equations are ubiquitous in science and engineering, where they are used to mathematically model various phenomena such as chemical reactions, epidemics, animal populations, and the movement of planets in the solar system <smart-cite bibId="gustafson_diff_eq"></smart-cite>. Solving such equations exactly or symbolically is very hard, however, and therefore we must resort to various algorithms to obtain approximate solutions instead.

In the <smart-link linkType="int" linkId="forward_euler">previous article</smart-link>, we introduced so-called initial-value problems (IVPs) that are composed of ordinary differential equations and an initial condition. In order to solve IVPs, we derived and implemented the forward Euler method. In this post we will cover the <em>backward</em> Euler method. This method is very similar to the forward method, but it is not the same. The difference is that the forward method is an <em>explicit method</em> while the backward method is an <em>implicit</em> method. What this difference exactly means and why we care is explained later in the article.

We will first show how the method works. Then, we derive the method and provide theoretical motivations. Finally, we will implement this method and apply it to a few IVPs.

## Contents

<tableOfContents></tableOfContents>

## Explanation of the method

In this section we will explain how the backward Euler method works and how it can be applied to initial-value problems. 

### Initial-value problems

We first give a formal definition of the problem we want to solve. This is identical to the <smart-link linkType="int" linkId="forward_euler">previous article</smart-link> on the forward Euler method.

<definition>
<envName>Initial-value problem</envName>
An initial-value problem (IVP) consists of an ODE
<display-math>
\frac{dy}{dt}(t) = f(t, y(t)),
</display-math>
and an <em>initial condition</em> $y_0$ at time $t_0$.

The <em>solution</em> of an IVP is a function $y$ such that $y(t_0) = y_0$ and $y'(t) = f(t, y(t))$ for all $t$.
</definition>

For an initial-value problem we thus know the rate of change $y'$ given by $f$, as well as the value of $y$ at a specific time $t_0$. Based on this we intend to find a function $y$ such that $y(t_0) = y_0$ for some initial point $t_0$, and such that the derivative $y'(t)$ equals $f(t, y(t))$ for all $t$. Due to the famous Picard-Lindelöf theorem, we know that under certain circumstances this IVP has a unique solution. More specifically, we require that $f$ is <em>Lipschitz-continuous</em>.

### Backward Euler method

We are now ready to formally define the backward Euler method:
<definition envId="forward_euler">
<envName>Backward Euler method</envName>
<p>Given are an ODE $y'(t) = f(t, y(t))$ and an initial condition $y(t_0) = y_0$, which together make up an initial value problem. We assume $f(t, y)$ to be Lipschitz-continuous in $y$. Additionally, we select a sufficiently small step size $h$.</p>

<p>
Using an iterative scheme defined as
<display-math>
y_{i+1} = y_i + h f(t_{i+1}, y_{i+1}),\,\text{with}\,i \in \{0, 1, \dots\},
</display-math> 
we can approximate the unique solution $y(t)$ of the IVP with values $y_i \approx y(t_i)$ and $t_i = t_0 + ih$.
</p>
</definition>

Note that this is different from the forward Euler method, whose update step is defined as
<display-math>
y_{i+1} = y_i + h f(t_i, y_i),\,\text{with}\,i \in \{0, 1, \dots\}.
</display-math> 
The difference is that in the forward case, we evaluate the ODE $f$ at $(t_i, y_i)$ while in the backward step we evaluate at $(t_{i+1}, y_{i+1})$.



### Solving non-linear equations

Now that we have an equation for every step of the backward Euler method, we still need to find a way to compute $y_{i+1}$ based on $y_i$. As you can see, the value $y_{i+1}$ appears on both sides of the equation: 
<display-math>
y_{i+1} = y_i + h f(t_{i+1}, y_{i+1}).
</display-math> 
If we move $y_{i+1}$ over to the other side, we get
<display-math>
y_i + h f(t_{i+1}, y_{i+1}) - y_{i+1} = 0.
</display-math>
This equation is a so-called <em>non-linear equation</em> where $y_{i+1}$ is the unknown variable. Note that the values $y_i$ and $t_{i+1}$ are already known.

Solving such non-linear equations is a field of research of its own right and many algorithms have been developed to solve such equations. These algorithms can range from very simple ones, such as Newton's method, to full-blown SMT-solvers. At some point in the future, we will cover some of these algorithms in a dedicated article. 

To keep the current exposition simple and clear, we will assume that we have an algorithm that magically gives us the solution to such non-linear equations. That is, given a non-linear equation
<display-math>
F(y) - y = 0,
</display-math>
this algorithm will give us a value $y$ such that the equation holds.

### Example

The backward Euler method thus works as follows:
1. Start with some value $y_i$ and compute $t_{i+1} = t_i + h$.
2. Take the equation $y_i + h f(t_{i+1}, y_{i+1}) - y_{i+1} = 0$, and plug it into a non-linear equation solver to obtain $y_{i+1}$.
3. Continue to the next iteration with $y_{i+1}$.

In order to illustrate how the method works step-by-step, we will consider the following IVP:

<display-math>
\begin{array}{rl}
y' &= -y^2 + t \\
y(0) &= 4.
\end{array}
</display-math>

This ODE is a Riccati equation <smart-cite bibId="wiki_riccati"></smart-cite>, since it is of the form $y' = q_0(t) + q_1(t)y + q_2(t)y^2$. We first formulate the backwards Euler equation for this ODE:

<display-math>
\begin{array}{rl}
y_{i+1} &= y_{i} + h f(y_{i+1}, t_{i+1}) \\
&= y_{i} + h (-y_{i+1}^2 + t_{i+1}) \\
&= y_{i} + h (-y_{i+1}^2 + t_{i} + h) \\
&= y_{i} - h y_{i+1}^2 + h t_i + h^2.
\end{array}
</display-math>

If we move all terms to the RHS of the equation, we get the following non-linear equation:

<display-math>
h y_{i+1}^2 + y_{i+1} - y_{i} - h t_i - h^2 = 0.
</display-math>

If we do this for 5 timesteps, then we get the following system of non-linear equations.
We take $h = 0.2$, and we have time-steps $t_0 = 0, t_1 = 0.2, t_2 = 0.4, t_3 = 0.6, t_4 = 0.8$, and $t_5 = 1.0$. The gives us the following equations:

<display-math>
\begin{array}{rl}
0.2 y_{1}^2 + y_{1} - y_{0} - 0.04 &= 0 \\
0.2 y_{2}^2 + y_{2} - y_{1} - 0.08 &= 0 \\
0.2 y_{3}^2 + y_{3} - y_{2} - 0.12 &= 0 \\
0.2 y_{4}^2 + y_{4} - y_{3} - 0.16 &= 0 \\
0.2 y_{5}^2 + y_{5} - y_{4} - 0.20 &= 0.
\end{array}
</display-math>

Since the equations depend on eachother, we will first have to solve the first equation, then the second equation, etc.

**Step 1**: We first resolve the step for $i=0$, where we need to compute $y_{1}$ based on $y_0$. In the equation $0.2 y_{1}^2 + y_{1} - y_{0} - 0.04 = 0$ we know the value $y_0 = 4$, and we wish to find the unknown value $y_{1}$. In order to solve this equation, we need to find the roots $x$ of the following polynomial:
<display-math>
0.2 x^2 + x - 4.04.
</display-math>

This equation has two roots:
<display-math>
\begin{array}{rll}
    x_1 &= - \frac{5}{2} - \frac{23}{2\sqrt{5}} &\approx -7.64296 \\
    x_2 &= - \frac{5}{2} + \frac{23}{2\sqrt{5}} &\approx 2.64296
\end{array}
</display-math>
From the Picard-Lindelof theorem we know that an IVP has a unique solution. This means that we need to figure out which one of the two roots is the actual solution to our backward Euler step.

A simple heuristic is to pick the one that is the closest to the solution of the forward Euler step. Forward Euler with step-size $h = 0.2$ would have produced the value
<display-math>
\begin{align*}
y_1 &= y_0 + h \cdot f(y_0, t_0) \\
    &= y_0 + h \cdot (-y_0^2 + t_0) \\
    &= 4 + 0.2 \cdot (-4^2 + 0) \approx 0.799999.
\end{align*}
</display-math>


Therefore, we choose the root $x_2$, such that 
<display-math>
    y_{1} = 2.64296.
</display-math>

**Step 2**: For the step with $i=1$ we have to solve the following equation:
<display-math>
0.2 y_{2}^2 + y_{2} - y_{1} - 0.08 = 0 
</display-math>
We know from the previous step that $y_{1} = 2.64296$, so this equation can be re-phrased as finding the roots $x$ in the following polynomial:
<display-math>
0.2 x^2 + x - 2.72296 
</display-math>
Once again, we are presented with two roots:
<display-math>
\begin{array}{rll}
    x_1 &\approx -6.95699 \\
    x_2 &\approx 1.95699.
\end{array}
</display-math>
This time the forward Euler method would have produced the value $y_2 = 1.285912$, and therefore we pick the root closest to that value, such that $y_2 = 1.956992$.

**Other steps**: The technique to solve the other equations is the same as for the previous two steps, so we will not work them out in detail here. Instead, we just list the values:

<display-math>
\begin{align}
    y_{3} &= 1.578598 \\
    y_{4} &= 1.365616 \\
    y_{5} &= 1.252077. \\
\end{align}
</display-math>

**Plotting:** Now that we have all the values $y \in \\{y_0, \dots, y_5\\}$ for the time steps $t \in \\{t_0, \dots, t_5\\}$, we can plot them. We also plot the exact solution to the ODE, as well as the computed roots we discarded during our computations.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="be_manual">
            <img src="/assets/images/num_ode/backward_euler/be_manual.png">
            <figcaption>Plot of the manually computed results.</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="be_manual_full">
            <img src="/assets/images/num_ode/backward_euler/be_manual_full.png">
            <figcaption>Plot including the alternative roots we did not use.</figcaption>
        </figure>
    </div>
</div>


## Derivation

Now that it is clear what we mean when we talk about the backward Euler method, we will explore some theoretical motivations as to why it works. We provide two separate motivations for the method. First, we will use Taylor series to derive the formula for our method. Second, we will use a simple numerical integration technique.

### Taylor series

Let us recall the definition of a first-order Taylor approximation:

<theorem envId="taylor_polynom">
    <envName>First-order Taylor approximation.</envName>
    Let $y(x)$ be a function with derivative $y'(a)$ at $a \in \mathbb{R}$. The first-order Taylor approximation of $y(x)$ centered at $a$, is defined as 
    <display-math>
        y(x) = y(a) + y'(a)(x-a) + R_a(x).
    </display-math>

    Here, $R_a(x)$ is the <em>remainder</em>, which is defined as

    <display-math>
        R_a(x) = \frac{f''(\xi)}{2}(x-a)^2,
    </display-math>
    for some real number $\xi \in [a, x]$.
</theorem>

Here $y(t)$ is the solution to our IVP. We assume that $y(t)$ is known up until $t_i$. Recall that $h = t_{i+1} - t_i$ is the time-step. In the previous article we set $a = t_i$ and $x = t_{i+1}$ and we obtained the forward Euler method:
<display-math>
y(t_{i+1}) = y(t_i) + y'(t_i)(t_{i+1} - t_i) = y(t_i) + h \cdot y'(t_i)
</display-math>

If instead we set $a = t_{i+1}$ and $x = t_{i}$ then we get a different method:
<display-math>
y(t_{i}) = y(t_{i+1}) + y'(t_{i+1})(t_{i}-t_{i+1}) = y(t_{i+1}) - h \cdot y'(t_{i+1})
</display-math>
If we re-arrange these terms, we get
<display-math>
y(t_{i+1}) = y(t_{i}) + h \cdot y'(t_{i+1}).
</display-math>

The distinction is between forward Euler and backward Euler is thus that in
forward Euler we center our Taylor approximation in current timestep, and evaluate $h$ time units in the future. In backward Euler, on the other hand, we center $h$ time units in the future and evaluate our Taylor approximation in the current timestep.

We can also see that the remainders are exactly the same, since 
<display-math>
(t_{i+1} - t_i)^2 = h^2 = (-h)^2 = (t_{i}-t_{i+1})^2.
</display-math>

### Quadrature

Another interesting way to motivate the backward Euler method is by using a numerical integration technique called <em>quadrature</em>. This technique takes an integral and approximates the integral over the time interval $[t_i, t_{i+1}]$ using a rectangle with height $f(t_{i+1}, y_{i+1})$. This is motivated by the fact that a differential equation can be solved by integrating it, due to the fundamental theorem of calculus.

Formally, the forward Euler method is derived using quadrature as follows:
<display-math>
\begin{aligned}
y(t_{i+1}) &= y(t_i) + \int_{t_i}^{t_{i+1}} y'(\tau) d\tau \\
&\approx y_i + h f(t_{i+1}, y_{i+1}).
\end{aligned}
</display-math>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="forward_euler_quadrature">
            <img src="/assets/images/num_ode/forward_euler_quadrature.png">
            <figcaption>Forward Euler.</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="backward_euler_quadrature">
            <img src="/assets/images/num_ode/backward_euler/quadrature.png">
            <figcaption>Backward Euler.</figcaption>
        </figure>
    </div>
</div>

In the two figures we can see the quadrature technique for forward and backward Euler, respectively. In the forward case, a rectangle with height $f(t_i, y_i)$ is considered, while the backward technique uses a rectangle with height $f(t_{i+1}, y_{i+1})$.

## Implementation

In order to see how the backward Euler method works in practice, we will implement it in Julia.
Earlier we discovered that in order to apply the backward method we need to solve a non-linear equation. In this article we will assume there exists an algorithm to solve such equations, without going too much into the details. More specifically we will use the `RobustMultiNewton` solver from the NonlinearSolve.jl package. Do note that many such solvers compute the derivative numerically and can therefore degrade the performance of the backward Euler method. Ideally you should use a solver that computes exact solutions to non-linear equations.

We start by creating a function that first computes the step-size given some initial-value problem and then runs a for-loop.

```julia
function solveBackwardEuler(diffEq; y0::Float64, t0::Float64, tn::Float64, numSteps::Integer)

    # set some values
    stepSize = (tn-t0)/numSteps
    currentVal::Float64 = y0
    currentTime::Float64 = t0

    # add initial condition to the list of output values
    funcVals = [(currentTime, currentVal)]

    for i in 0:numSteps-1
        # increase time from t_i to t_i+1
        nextTime = currentTime + stepSize

        currentVal = solveNonLinearEquation(diffEq, currentTime, currentVal, nextTime, stepSize)
        currentTime = nextTime

        # store value (t_i+1, y_i+1)
        push!(funcVals, (currentTime, currentVal))
    end

    return funcVals
end

```

In the for-loop, we will repeatedly solve the backward Euler formula for every time-step. The actual code where the non-linear equation is solved for that specific time-step, is implemented in a separate function:

```julia
function solveNonLinearEquation(diffEq, currentTime, yCur, nextTime, stepSize )
    # use forward Euler to obtain the starting value for our solver
    # forward Euler method formula y_i+1 = y_i + h * f(t_i, y_i)
    forwardEuler(yCur) = yCur + stepSize * diffEq(currentTime, yCur)

    # call forward Euler to get an initial estimate
    u0 = forwardEuler(yCur)

    # backward Euler method formula y_i+1 = y_i + h * f(t_i+1, y_i+1)
    backwardEuler(yNext, p) = yCur + stepSize * diffEq(nextTime, yNext) - yNext

    # solve non linear eq
    problem = NonlinearProblem(backwardEuler, u0)
    nextVal = solve(problem, RobustMultiNewton()).u

    # update values
    currentVal = nextVal

    return currentVal
end
```

The `RobustMultiNewton` solver requires two things: the non-linear equation we wish to solve, and an initial <em>guess</em> for the solution. The solver will then start with that guess, and work its way
towards the actual solution, step by step.

In the previous article we saw that the forward Euler method is a simple and effective way to solve initial-value problems. We will thus first use the forward method to guess the value $y_{i+1}$,
and then ask the `RobustMultiNewton` solver to refine it to a more accurate value. The forward Euler formula is implemented in the `forwardEuler` function, while the backward Euler formula that is used by the solver is implemented in `backwardEuler`.

The result of this code is a list of tuples $(t_i, y_i)$ such that $y_i$ is the approximate solution
at time $t_i$.

## A library of IVPs

In the previous article, we introduced two initial-value problems. In this article and in the future, we will introduce many more IVPs. In order to keep things nice and clean, we need to program some infrastructure that allows us to easily define IVPs.

We will first define a struct called `InitialValueProblem`:

```julia
struct InitialValueProblem
    diffEq
    initialValue
    initialTime
    endTime
    exactSolution
end
```

In order to store a specific IVP inside such a struct, we simply provide values for the different member variables of the struct:

```julia
function getInitialValueProblem()::InitialValueProblem
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

We can then instantiate and pass such structs to our backward Euler solver:

```julia
ivp = getInitialValueProblem()
functionValues = solveBackwardEuler(ivp.diffEq, y0=ivp.initialValue, t0=ivp.initialTime, tn=ivp.endTime, numSteps=1000)
plot!(functionValues, label="Solution")
```


## Demonstration

In this section we will take the implementation above and apply it to a number of interesting ODEs. More specifically, we will be taking ODEs from some articles <smart-cite bibId="math1902_stiff_examples"> 
</smart-cite> <smart-cite bibId="cleve_moler_blogpost"> 
</smart-cite> that I found that talk about so-called <em>stiff</em> ODEs.

A <em>stiff</em> ODE is one that is numerically difficult to solve, due to floating point imprecisions. Due to the better stability properties, the backward Euler method should handle these better than the forward Euler method.

### A deceptively simple ODE

<!-- https://people.sc.fsu.edu/~jburkardt/classes/math1902_2020/stiff/stiff.pdf -->

We fill first cover the ODE <smart-cite bibId="math1902_stiff_examples"> 
</smart-cite> given by the following system of equations:

<display-math>
\begin{align*}
y'(t) &= 50(\cos(t) - y)\\
y(0) &= 0.
\end{align*}
</display-math>

For this initial value problem we can obtain the following closed-form solution:
<display-math>
y(t) = 50 \frac{\sin(t) + 50 \cos(t) - 50 e^{-50t}}{2501}.
</display-math>

We can then implement this IVP as a ```InitialValueProblem``` struct and call the forward and backward Eulers solver we implemented previously. The result can be seen in <smart-ref targetType="fig" targetId="backward_euler_stiff_fe"></smart-ref> and <smart-ref targetType="fig" targetId="backward_euler_stiff_be"></smart-ref>.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="backward_euler_stiff_fe">
            <img src="/assets/images/num_ode/backward_euler/stiff_fe.png">
            <figcaption>Forward Euler.</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="backward_euler_stiff_be">
            <img src="/assets/images/num_ode/backward_euler/stiff_be.png">
            <figcaption>Backward Euler.</figcaption>
        </figure>
    </div>
</div>

<p><smart-ref targetType="fig" targetId="backward_euler_stiff_fe"></smart-ref> depicts the trajectories obtained using the forward Euler technique, while the ones in <smart-ref targetType="fig" targetId="backward_euler_stiff_be"></smart-ref> were obtained using the backward Euler rule. In both cases the same time-step values were used.</p>

We can see that for lower time-step sizes forward Euler exhibits oscilliatory behaviour, while the backward technique produces reasonable trajectories even if they still deviate from the exact solution. For smaller time-steps, both methods perform well.

### Flame

<!-- It is due to Lawrence Shampine (cite Moler, https://people.sc.fsu.edu/~jburkardt/py_src/flame_odefun/flame_odefun.py; https://themaximalist.org/2021/03/19/eulix-a-stiff-ode-solver-in-maxima/; https://www.dam.brown.edu/people/alcyew/handouts/numODE5.pdf). -->

Our next experiment involves an ODE that models the growth of a flame. I read about it in a blogpost <smart-cite bibId="cleve_moler_blogpost"> 
</smart-cite> written by Cleve Moler, creator of the popular MATLAB software. He attributes it to Lawrence Shampine, who developed ODE solver routines for MATLAB.

<display-math>
\begin{align*}
y' &= y^2 - y^3\\
y(0) &= \delta, \\
t &\in \left[0, \frac{2}{\delta}\right].
\end{align*}
</display-math>


The intuition for the ODE is that the oxygen needed to sustain a flame is propotional to its volume ($-y^3$). However, the flame obsorbs oxygen via its surface, which is quadratic ($y^2$). We first solve our IVP for $\delta=0.01$.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="flame_fe_easy">
            <img src="/assets/images/num_ode/backward_euler/flame_fe_easy.png">
            <figcaption>Forward Euler $\delta = 0.01$.</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="flame_be_easy">
            <img src="/assets/images/num_ode/backward_euler/flame_be_easy.png">
            <figcaption>Backward Euler $\delta = 0.01$.</figcaption>
        </figure>
    </div>
</div>


Once gain we see that forward Euler exhibits oscilliatory behaviour in <smart-ref targetType="fig" targetId="flame_fe_easy"></smart-ref>. Backward Euler in <smart-ref targetType="fig" targetId="flame_be_easy"></smart-ref>, on the other hand, produces more "stable" trajectories, even if they deviate from the actual solution.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="flame_fe_hard">
            <img src="/assets/images/num_ode/backward_euler/flame_fe_hard.png">
            <figcaption>Forward Euler $\delta = 0.0001$.</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="flame_be_hard">
            <img src="/assets/images/num_ode/backward_euler/flame_be_hard.png">
            <figcaption>Backward Euler $\delta = 0.0001$.</figcaption>
        </figure>
    </div>
</div>



Additionally, we will solve a more difficult IVP with $\delta=0.0001$. The results can be seen in <smart-ref targetType="fig" targetId="flame_fe_hard"></smart-ref> and  <smart-ref targetType="fig" targetId="flame_be_hard"></smart-ref>. Here, we see that backward Euler already produces "reasonable" trajectories for step-size $h=200$ and a decent trajectory for $h=20$, while forward Euler is still struggling with step sizes as small as $h=2$.

### Another simple ODE

Another deceptively simple example  is the "QUADEX" ODE <smart-cite bibId="math1902_stiff_examples">
</smart-cite>, given by the following equations:

<display-math>
\begin{align*}
y' &= 5 \cdot (y − t^2)\\
y(0) &= \frac{2}{25}.
\end{align*}
</display-math>

The exact solution is given by 
<display-math>
y(t) = ce^{5t} + t^2 + \frac{2t}{5} + \frac{2}{25}
</display-math>
where $c = 0$ for our chosen initial condition. Note that for slightly different initial conditions we have $c \neq 0$, which introduces an exponential component into the solution. 

For this ODE we therefore have that even tiny deviations from the trajectory at one point will cause the subsequent points to deviate exponentially from the curve.


<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="quadex_fe">
            <img src="/assets/images/num_ode/backward_euler/quadex_fe.png">
            <figcaption>Forward Euler.</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="quadex_be">
            <img src="/assets/images/num_ode/backward_euler/quadex_be.png">
            <figcaption>Backward Euler.</figcaption>
        </figure>
    </div>
</div>

The forward and backward techniques are depicted in <smart-ref targetType="fig" targetId="quadex_fe"></smart-ref> and <smart-ref targetType="fig" targetId="quadex_be"></smart-ref>, respectively. We can see that for this IVP both methods perform bad and produce deviations.

### Stable ODE for cosine

Next, we consider the "stable ODE" <smart-cite bibId="two_ode_examples"></smart-cite> from the previous article, given by

<display-math>
\begin{array}{rl}
y'(t) &= - y - \sin(t) + \cos(t), \\
y(0) &= 1.
\end{array}
</display-math>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="stable_fe">
            <img src="/assets/images/num_ode/backward_euler/stable_fe.png">
            <figcaption>Forward Euler.</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="stable_be">
            <img src="/assets/images/num_ode/backward_euler/stable_be.png">
            <figcaption>Backward Euler.</figcaption>
        </figure>
    </div>
</div>

We can see that both methods perform well and that the errors remain stable, even across multiple periods.

### Unstable ODE for cosine

Finally, we also consider the "unstable" ODE <smart-cite bibId="two_ode_examples"></smart-cite> from the previous article:

<display-math>
\begin{array}{rl}
y'(t) &= y - \sin(t) - \cos(t), \\
y(0) &= 1.
\end{array}
</display-math>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="unstable_fe">
            <img src="/assets/images/num_ode/backward_euler/unstable_fe.png">
            <figcaption>Forward Euler.</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="unstable_be">
            <img src="/assets/images/num_ode/backward_euler/unstable_be.png">
            <figcaption>Backward Euler.</figcaption>
        </figure>
    </div>
</div>

We see that both the forward and backward methods do not perform well on this IVP.

## Some afterthoughts

When I began writing this article, I expected it to be straightforward just like the previous article on the forward Euler method. However, the backward Euler method seemed to be more challenging. Its advantages compared to the forward Euler rule have to do with its stability properties and also the error analysis turned out to be less trivial. There was also the implementational challenge of solving non-linear equations, with many different solver techniques to choose from.

This leaves us with a few ideas for future articles:
- Investigate stability theory. This is an old and still active area of research spanning multiple decades, and the literature is extensive. This also involves many different concepts such as linear and non-linear ODEs, imaginary numbers, topology, etc.
- Currently, we numerically approximate the derivative in the non-linear solver, and therefore we might be incurring errors. It could be interesting to re-do some of the experiments with an exact derivative (e.g., symbolic or automatic differentiation), or an exact non-linear solver such as an SMT solver (e.g., Z3).
- Better understanding stability theory might also lead us to global error bounds for the backward Euler method, which are currently missing from this article.

## Conclusion

We began this article with a recap of initial-value problems. We then proposed a new technique: the backward Euler method. We derived this technique using both Taylor series and quadrature. Then, we applied the technique by hand to an example IVP. Finally, we implemented the technique in Julia and applied it to various IVPs.

As noted in the "afterthoughts" section, this backwards Euler technique turned out to be more challenging than the forward Euler technique. I plan to investigate related topics such as stability theory in the future. Additionally, I will cover other solver techniques such as Runge-Kutta solvers. Stay tuned!

## References

<bibliography>
</bibliography>

