---
layout: page
title: Runge-Kutta methods
permalink: /posts/num_ode/runge_kutta
exclude: true
referenceId: runge_kutta
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

Differential equations are often hard or impossible to solve symbolically. Such equations are, however, widely used in science and engineering, finding applications in physics, chemistry, biology, and epidemiology <smart-cite bibId="gustafson_diff_eq"></smart-cite>. As a result, much work has gone into developing algorithms that approximate solutions to differential equations.

In this article, we will be covering the Runge-Kutta method, which is a method for approximating solutions to ordinary differential equations. The history of the Runge-Kutta method began in 1895 when Carl Runge published a paper in which he generalised the forward Euler method <smart-cite bibId="runge1895"></smart-cite><smart-cite bibId="butcher96_rk_history"></smart-cite>. His generalisation involved sampling the ODE $f(t,y)$ at multiple points $(t,y)$ and then combining those samples into approximations of function values. This led to so-called higher order methods, that are more accurate than the forward Euler method. In particular, Runge introduced the midpoint method <smart-cite bibId="butcher96_rk_history"></smart-cite>.

Shortly afterwards, other researchers picked up on his idea and published additional methods <smart-cite bibId="butcher96_rk_history"></smart-cite>. These include Karl Heun, who published Heun's predictor-corrector method in 1900 <smart-cite bibId="heun1900"></smart-cite>, and Martin Kutta, who published his now-famous paper in 1901 <smart-cite bibId="kutta1901"></smart-cite>. In the present day, these methods are all referred to as <em>Runge-Kutta methods</em>.

One of the main advantages of the Runge-Kutta methods is that they allow for greater accuracy at a lower computational cost. Additionally, they only make use of the ODE itself (i.e., the first-order derivative) and do not involve higher-order derivatives. This is remarkable, since higher order Taylor polynomials do make use of such higher-order derivatives <smart-cite bibId="burden_and_faires"></smart-cite>. Note that using higher order derivatives would require us to either symbolically or numerically compute the higher derivatives, which can be computationally intensive.

## Overview

<tableOfContents></tableOfContents>

## Runge-Kutta methods

Before we introduce the Runge-Kutta method, we will first recall the definition of an initial-value problem.

<definition>
<envName>Initial-value problem</envName>
An initial-value problem (IVP) consists of an ODE
<display-math>
\frac{dy}{dt}(t) = f(t, y(t)),
</display-math>
and an <em>initial condition</em> $y_0$ at time $t_0$.

The <em>solution</em> of an IVP is a function $y$ such that $y(t_0) = y_0$ and $y'(t) = f(t, y(t))$ for all $t$.
</definition>

We thus have the time derivative $\frac{dy}{dt}$ of the unknown function $y$ and we also know the function value at a specific point such that $y(t_0) = y_0$. Based on that, we wish to find the corresponding function $y$.

One way to approximate the solution $y$ of the initial-value problem, is to employ a Runge-Kutta method. There are multiple such methods, and below we give a general definition that ties them all together.

<definition envId="rk_general">
<envName>Explicit Runge-Kutta method with $n$ stages, from <smart-cite bibId="wiki_runge_kutta"></smart-cite></envName>
<p>Given are an ODE $y'(t) = f(t, y(t))$ and an initial condition $y(t_0) = y_0$, which together make up an initial value problem. We assume $f(t, y)$ to be Lipschitz-continuous in $y$. Additionally, we select a sufficiently small step size $h$.</p>

<p>
Using an iterative scheme defined as
<display-math>
y_{i+1} = y_i + h \sum_{s=1}^n b_s k_s,
</display-math> 
we can approximate the unique solution $y(t)$ of the IVP with values $y_i \approx y(t_i)$ and $t_i = t_0 + ih$.
Here, $n \in \mathbb{N}$ is the number of stages of the Runge-Kutta method and $\vec{b} \in \mathbb{R}^n$ is a vector.
</p>

<p>
The values $k_s$ for $s \in \{1, \dots, n\}$ are given by
<display-math>
	k_{s} = f\left(t_i + c_s h, y_i + h\sum_{j=1}^{s-1} a_{sj}k_{j}\right),
</display-math>
where $\vec{c} \in \mathbb{R}^n$ is a vector with $c_0=0$, and $[a_{ij}] \in \mathbb{R}^{n \times n}$ is a (strictly lower-triangular) matrix.
</p>
</definition>

<p>The above definition defines a <em>family</em> of Runge-Kutta methods. Each method is characterised by its number of stages (the value of $n$) and its coefficients (values for $[a_{ij}], \vec{b}, \vec{c}$). In the literature, the matrix $[a]_{ij}$ is called the <em>Runge-Kutta matrix</em>, and $\vec{b}$ and $\vec{c}$ are referred to as the <em>weights</em> and <em>nodes</em>, respectively.</p>

Aside from the number of stages, a Runge-Kutta method also has an <em>order</em>. The difference between the number of stages and the order, is that the number of stages refers to the number of values $k_1, \dots, k_n$ that are computed. The order, on the other hand, refers to the accuracy of the method (i.e., how closely the method will approximate the actual solution). The order, however, is more difficult to determine. It depends on the coefficients that are used, and the number of stages might be higher than the order of a method <smart-cite bibId="butcher_book"></smart-cite>.

<p>Note that in the above definition we only consider strictly lower-triangular matrices. However, there also exist Runge-Kutta methods with any matrix $[a_{ij}]$. If the values $a_{ij}$ are non-zero for $i \leq j$, then we are dealing with an <em>implicit</em> Runge-Kutta method. In that case, the values $k_i$ can be inter-dependent (e.g., $k_1$ depends on $k_2$ and vice-versa). Such a scheme then forms a system of non-linear equations <smart-cite bibId="wiki_runge_kutta"></smart-cite>.</p>

In this article we will only deal with explicit Runge-Kutta methods. The value $k_{i}$ will only depend on values $k_{j}$ with $j < i$. The resulting formulas can be solved using simple arithmetic and without solving a system of equations.

## Choosing coefficients

<p>In the previous section, the general formula for Runge-Kutta methods was introduced. We can see that there are many possibilities of choosing $n, [a_{ij}], \vec{b}, \vec{c}$, with each combination of values producing its own Runge-Kutta method. A so-called <em>Butcher tableau</em> can be used to arrange these values in a standardised and easy to use format. This format is named after John C. Butcher who introduced such tables in 1964 <smart-cite bibId="butcher1964_implicit"></smart-cite>.</p>

In the general case, for a Runge-Kutta method with $n$ stages, we get the following table:
<display-math>
\begin{array}
{c|ccccc}
0 \\
c_2     & a_{2,1} \\
c_3     & a_{3,1}    & a_{3,2} \\
\vdots  & \vdots    & \vdots    & \ddots & \\
c_{n-1} & a_{n-1,1} & a_{n-1,2} & \cdots & a_{n-1,n-2}\\
c_n     & a_{n,1}   & a_{n,2}    & \cdots & a_{n,n-2} & a_{n,n-1}\\
\hline
        & b_1       & b_2       & \cdots & b_{n-1} & b_n
\end{array}
</display-math>

We can now consider specific Runge-Kutta methods by fixing values for $n$, $[a_{ij}]$, $\vec{b}$, and $\vec{c}$. If we take $n=1$ we arrive at the forward Euler method:
<display-math>
y_{i+1} = y_i + hf(t_i, y_i),
</display-math>
since $c_1 = 0$ and the sum over $a_{sj}$ falls away. Also note that $\sum_s b_s = 1$. This leads to a very tiny Butcher tableau:
<display-math>
\begin{array}
{c|c}
0\\
\hline
& 1
\end{array}
</display-math>

The forward Euler method is quite simple and has been covered in an <smart-link linkType="int" linkId="forward_euler">earlier article</smart-link>. We can also obtain more complicated Runge-Kutta methods by choosing a higher value for $n$. If we fix $n=4$ together with a specific set of coefficients <smart-cite bibId="kutta1901">end of section III</smart-cite>, we get the well known 4th order Runge-Kutta method:

<display-math>
y_{i+1} = y_i + h \frac{k_1 + 2k_2 + 2k_3 + k_4}{6},
</display-math>

<display-math>
\begin{align*}
k_1 &= f(t_i, y_i)\\
k_2 &= f(t_i + \frac{h}{2}, y_i + k_1\frac{h}{2})\\
k_3 &= f(t_i + \frac{h}{2}, y_i + k_2\frac{h}{2})\\
k_4 &= f(t_i + h, y_i + hk_3)\\
\end{align*}
</display-math>

We can once again represent this as a Butcher tableau:
<display-math>
\begin{array}
{c|cccc}
0\\
\frac{1}{2} & \frac{1}{2}\\
\frac{1}{2} &0 &\frac{1}{2} \\
1& 0& 0& 1\\
\hline
& \frac{1}{6} &\frac{1}{3} &\frac{1}{3} &\frac{1}{6} 
\end{array}
</display-math>
The above coefficients are well-known and widely used.

As noted earlier, many values for $n$, $[a_{ij}]$, $\vec{b}$, and $\vec{c}$ can be chosen with quite some degrees of freedom. However, each combination of values must satisfy the so-called <em>order conditions</em>, which differ for each value of $n$. In the beginning of the 20th century it was standard practice to derive these conditions by investigating the Taylor series of the Runge-Kutta formula. In the 1960s, J.C. Butcher developed a generalised theory for Runge-Kutta methods <smart-cite bibId="butcher96_rk_history"></smart-cite>.

In future articles we will investigate these order conditions more in-depth. For the purpose of this article, we will simply make use of coefficients that can be found in the literature and we will assume those are correct.

## Intuitive explanation using Quadrature

While the Runge-Kutta formulas may look quite abstract, they can be quite intuitively explained using numerical integration techniques. In this section we will use Simpson's rule <smart-cite bibId="wiki_simpson_integration"></smart-cite> to motivate the 4th order Runge-Kutta method with Kutta's coefficients. In the literature, numerical integration is also referred to as <em>quadrature</em>.

The idea of using numerical integration is motivated by the fact that an initial-value problem of the form
<display-math>
\begin{align*}
    y'(t) &= f(t, y), \\
    y(t_0) &= y_0,
\end{align*}
</display-math>
can be solved using integration. Let $t_a$ and $t_b$ be time values such that $t_0 \leq t_a \leq t_b$. We then have that
<display-math>
y(t_b) = y(t_a) + \int_{t_a}^{t_b} f(\tau, y(\tau)) d\tau.
</display-math>

When applying our numerical integration technique, we approximate this integral with a sum such that 
<display-math>
\int_{t_a}^{t_b} f(\tau, y(\tau)) d\tau \approx \sum_s b_s f(t_s, y(t_s)),
</display-math>
where the $b_s$ are the weights and the values $t_s$ are the time values at which we sample the integrand (i.e., our ODE $f(t,y)$). Our integral is thus approximated with a weighted sum of function values.

In this section we will use the above principle to intuitively explain fourth order Runge-Kutta with Kutta's coefficients. Note, however, that this does not constitute a rigorous proof of the method. In a future article we will dive into a more formal motivation for the correctness of the Runge-Kutta method.

### Simpson's rule

Let us first introduce Simpson's rule <smart-cite bibId="wiki_simpson_integration"></smart-cite>. In the general case, this technique is used to approximate definite integrals $\int_{a}^{b}f(\tau)d\tau$ by splitting the integration interval $[a,b]$ into $n$ sub-intervals, where $n$ is an even number. We then approximate the function $f$ across this interval using $\frac{n}{2}$ quadratic polynomials, one for each pair of intervals. The final integral is then the sum of the integrals of the quadratic polynomials.

Consider the general formula
<display-math>
\begin{align*}
  \int_a^b f(t) dt
  &\approx \frac{b-a}{6} \sum_{i = 1}^{n/2} \left[f(t_{2i - 2}) + 4f(t_{2i - 1}) + f(t_{2i})\right]\\
  &= \frac{b-a}{6} \left[f(t_0) + 4f(t_1) + 2f(t_2) + 4f(t_3) + 2f(t_4)\right. \\
  &\quad\quad\quad \left.  + \dots + 2f(t_{n - 2}) + 4f(t_{n - 1}) + f(t_n)\right].
\end{align*}
</display-math>

If we evaluate this rule for $n=2$, we get
<display-math>
\begin{align*}
  \int_a^b f(t) dt
  &\approx \frac{b-a}{6} \left[f(t_{0}) + 4f(t_{1}) + f(t_{2})\right].
\end{align*}
</display-math>

We can see that the fraction $\frac{b-a}{6}$ appears in the formula above. In the literature, however, the formula will sometimes instead contain $\frac{h}{3}$ with $h=\frac{b-a}{2}$ <smart-cite bibId="wiki_simpson_integration"></smart-cite>. This can be confusing, since in the Runge-Kutta literature we have $h=b-a$.

### Simple case

We will first cover the case where the ODE $f(t,y)$ does not depend on $y$, such that $y'(t) = f(t)$. Solving this formula is then a simple matter of integration.

If we take the ODE $y'(t) = f(t)$ and we use 4th order Runge-Kutta with a classic choice of coefficients <smart-cite bibId="kutta1901"></smart-cite>, we get
<display-math>
\begin{align*}
y_{i+1} &= y_i + h \frac{1}{6} \left[f(t_i) + 2f\left(t_i + \frac{h}{2}\right) + 2f\left(t_i + \frac{h}{2}\right) + f(t_i + h)\right] \\
&= y_i + h \frac{1}{6} \left[f(t_i) + 4f\left(t_i + \frac{h}{2}\right) + f(t_i + h)\right].
\end{align*}
</display-math>

This is exactly Simpson's formula for $n=2$ with points $t_0 = t_i, t_1 = t_i + \frac{h}{2}$, and $t_2 = t_i + h$ to approximate $\int_{t_i}^{t_i + h} f(t) dt$.

### General case

Let us now turn to a differential equation where the derivative depends on both $y$ and $t$. That is, $y'(t) = f(t, y)$. Recall the $y$-independent Runge-Kutta formula from earlier:
<display-math>
y_{i+1} = y_i + h \frac{1}{6} \left[f(t_i) + 4f\left(t_i + \frac{h}{2}\right) + f(t_i)\right].
</display-math>

If we want to include a dependency on $y$, we get something of the form
<display-math>
y_{i+1} = y_i + h \frac{1}{6} \left[f(t_i, y(t_i)) + 4f\left(t_i + \frac{h}{2}, y\left(t_i + \frac{h}{2}\right)\right) + f\left(t_i + h, y\left(t_i + h\right)\right)\right].
</display-math>

However, we do not know $y(t)$ for $t > t_i$ and we thus need to come up with an approximation. To solve this, the Runge-Kutta method uses various intermediate values $k_s$ for which 
<display-math>
\begin{align*}
k_1 &= f(t_i, y_i),\\
k_2 &= f\left(t_i + \frac{h}{2}, y_i + k_1\frac{h}{2}\right),\\
k_3 &= f\left(t_i + \frac{h}{2}, y_i + k_2\frac{h}{2}\right), \\
k_4 &= f(t_i + h, y_i + hk_3).\\
\end{align*}
</display-math>

Even though these formulas might look complicated at first, it is clear that each $k_s$ is a value of the ODE $f(t,y)$ at some point, which are also the derivatives $y'(t)$ of the solution $y(t)$. First of all, if we look at the time values, we can see that the derivative is computed at four points in time: once at $t_i$, twice at $t_i + \frac{h}{2}$, and once at $t_i + h$.

The values for $y$ are more complicated, however. If we look closely, they are always of the form $y_i + a \cdot k_s$, where $a$ is some real number and the $k_s$ is equal to some value of the ODE $f(t,y)$. We therefore have that each of these values are actually linear approximations of $y$ at various points in time, where some value of $f(t,y)$ is used instead of the actual derivative of $y$. Clever!

To get a more systematic overview, consider the following table:
<table>
    <thead><tr>
        <th>$k_s$</th>
        <th>Meaning</th>
        <th>Used approximation of $y(t)$</th>
    </tr></thead>
    <tbody>
        <tr>
            <td>$k_1$</td>
            <td>$f(t_i, y(t_i))$</td>
            <td>$y(t_i) \approx y_i$</td>
        </tr>
        <tr>
            <td>$k_2$</td>
            <td>$f\left(t_i + \frac{h}{2}, y\left(t_i + \frac{h}{2}\right)\right)$</td>
            <td>$y\left(t_i + \frac{h}{2}\right) \approx y_i + \frac{h}{2} k_1 \approx y_i + \frac{h}{2} f(t_i, y(t_i))$</td>
        </tr>
        <tr>
            <td>$k_3$</td>
            <td>$f\left(t_i + \frac{h}{2}, y\left(t_i + \frac{h}{2}\right)\right)$</td>
            <td>$y\left(t_i + \frac{h}{2}\right) \approx y_i + \frac{h}{2} k_2 \approx y_i + \frac{h}{2} f\left(t_i + \frac{h}{2}, y\left(t_i + \frac{h}{2}\right)\right)$</td>
        </tr>
        <tr>
            <td>$k_4$</td>
            <td>$f(t_i + h, y(t_i + h)$</td>
            <td>$y(t_i + h) \approx y_i + h k_3 \approx y_i + h f\left(t_i + \frac{h}{2}, y\left(t_i + \frac{h}{2}\right)\right)$</td>
        </tr>
    </tbody>
</table>
In the table above we can see in the first column the value $k_s$ that is being computed. In the second column, we see the value of $f(t,y)$ that $k_s$ is supposed to approximate. Finally, in the third column, we can see how the unknown value of $y(t)$ is approximated to compute the ODE value at that point in time.

Let us consider each $k_s$ in detail now. The first value, $k_1$, computes the derivative $f(t_i, y(t_i))$ by approximating $y(t_i)$ with $y_i$.

The value $k_2$ approximates the value $f\left(t_i + \frac{h}{2}, y\left(t_i + \frac{h}{2}\right)\right)$. Since we do not know $y\left(t_i + \frac{h}{2}\right)$ we linearly approximate it using $y_i + \frac{h}{2} k_1 \approx y_i + \frac{h}{2} f(t_i, y(t_i))$. If we look closely, we can see that this is a forward Euler approximation with step size $\frac{h}{2}$. If we use this approximated $y$-value, we get $k_2 = f(t_i + \frac{h}{2}, y_i + k_1\frac{h}{2})$.

The next values of $k_s$ are a bit less straightforward. The value $k_3$ again approximates $f\left(t_i + \frac{h}{2}, y\left(t_i + \frac{h}{2}\right)\right)$. This time, we approximate $y\left(t_i + \frac{h}{2}\right)$ using $y_i + \frac{h}{2}k_2$. This can be seen as some sort of approximate backward Euler using the derivative at $t_i + \frac{h}{2}$ and step-size $\frac{h}{2}$.

The value $k_4$ approximates the derivative at $t_i + h$. It does this by approximating $y(t_i + h)$ with $y_i + hk_3$, where $k_3$ in turn is an approximation of the derivative at $t_i + \frac{h}{2}$.

Finally, all these values are plugged into the Simpson's rule, in order to obtain the Runge-Kutta step we saw earlier:
<display-math>
y_{i+1} = y_i + h \frac{k_1 + 2k_2 + 2k_3 + k_4}{6}.
</display-math>

We can thus conclude that the Runge-Kutta method samples the ODE at various points, and then aggregates them into $y_{i+1} \approx y(t_{i+1})$. To illustrate this, we consider the following figures:

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rk4_step_cos">
            <img src="/assets/images/num_ode/runge_kutta/rk4_kutta_cos.png">
            <figcaption>The ODE $y' = -y - \sin(t) + \cos(t)$</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="rk4_step_nonstiff">
            <img src="/assets/images/num_ode/runge_kutta/rk4_kutta_nonstiff.png">
            <figcaption>The ODE $y' = \sin(t)^2 \cdot y$</figcaption>
        </figure>
    </div>
</div>

These two figures illustrate one single Runge-Kutta step for two different initial-value problems.

The diamonds are approximations of the solution to the IVP. The red diamond is the point $(t_i, y_i)$ and forms the starting point of the iteration. The green diamond is the point $(t_{i+1}, y_{i+1})$ that forward Euler would produce. The black diamond is the point $(t_{i+1}, y_{i+1})$ produced by the fourth order Runge-Kutta method. Also note that the red curve is the exact solution to an IVP on that ODE with initial value $y_i$, for reference.

To gain more insight into the intermediate values $k_s$ that Runge-Kutta uses to approximate the IVP, there are small lines and blue dots. Each blue dot indicates a point $(t, \hat{y})$ where the ODE was sampled and the slope at that point indicates the computed value $f(t, \hat{y})$. Note that $\hat{y}$ is the linear approximation of $y$, as explained earlier.

### Other Runge-Kutta methods

Up until now, we focussed on explaining the fourth order Runge-Kutta method with Kutta's coefficients. However, as we saw earlier, many other possible coefficients exist. Even though those can be harder to illustrate, the same principle still applies.

Let us reconsider the general formula for $k_s$:
<display-math>
    k_{s} = f\left(t_i + c_s h, y_i + h\sum_{j=1}^{s-1} a_{sj}k_{j}\right),
</display-math>

This value $k_s$ approximates the derivative $y'(t_i + c_s h) = f(t_i + c_s h, y(t_i + c_s h))$. Since the value $y(t_i + c_s h)$ is unknown because we only know $y(t)$ for $t \in \\{t_0, \dots, t_i\\}$, we instead approximate it using $y_i + h\sum_{j=1}^{s-1} a_{sj}k_{s}$. This can be seen as a linear approximation using a weighted average of derivatives.

## Implementation

Now that we understand the Runge-Kutta formulas, it is time to implement them in Julia. We will first implement the general formulas from <smart-ref targetId="rk_general" targetType="def"></smart-ref> and then also define some coefficients for a second, third, and fourth order Runge-Kutta method.

Let us first consider the high-level loop that goes over every time-step, and then applies the Runge-Kutta step to obtain $(t_{i+1}, y_{i+1})$ from $(t_{i}, y_{i})$.

```julia
function solveRungeKuttaExplicit(; # force caller to use keywords
    ivp::InitialValueProblem, stepSize::Float64, 
    numStages::Int64, 
    a::Matrix{Float64}, b::Vector{Float64}, c::Vector{Float64}
)::Vector{Tuple{Float64,Float64}}

    # check that the dimensions of a,b,c match the specified order
    if size(a) != (numStages, numStages)
        throw(ArgumentError("Error: the number of stages do not correspond
            with the dimensions of 'a'."))
    end

    if size(b) != (numStages,)
        throw(ArgumentError("Error: the number of stages do not correspond
            with the dimensions of 'b'."))
    end

    if size(c) != (numStages,)
        throw(ArgumentError("Error: the number of stages do not correspond
            with the dimensions of 'c'."))
    end

    # set some values
    currentVal::Float64 = ivp.initialValue
    currentTime::Float64 = ivp.initialTime

    # add initial condition to the list of output values
    funcVals = [(currentTime, currentVal)]

    while (currentTime + stepSize) <= ivp.endTime
        # compute next value
        currentVal = rungeKuttaStepExplicit(ivp=ivp, stepSize=stepSize, 
            currentTime=currentTime, currentVal=currentVal,
        numStages=numStages, a=a, b=b, c=c)
        currentTime = currentTime + stepSize

        # store next value
        push!(funcVals, (currentTime, currentVal))
    end

    return funcVals
end
```

In the above code we can see a while-loop where each iteration there is a call to `rungeKuttaStepExplicit` and the result is stored in a vector `funcVals`. The `funcVals` vector contains the actual values $(t_{i}, y_{i})$ produced by the Runge-Kutta algorithm. We can see that the while-loop is quite simple. The actual machinery, including the computation of the various values $k_s$, is implemented in the `rungeKuttaStepExplicit` function.

```julia
function rungeKuttaStepExplicit(; # force caller to use keywords
    ivp::InitialValueProblem, stepSize::Float64, 
    currentTime::Float64, currentVal::Float64, 
    numStages::Int64, 
    a::Matrix{Float64}, b::Vector{Float64}, c::Vector{Float64})::Float64

    # verify that the first row is zero
    if !iszero(a[1, 1:end])
        throw(ArgumentError("Error: this function only supports explicit 
            RK methods, but an implicit coefficient matrix was passed."))
    end

    k_vals = [ivp.diffEq(currentTime, currentVal)]

    # iterate
    for s in 2:numStages
        # compute time value
        time_val = currentTime + c[s] * stepSize

        # compute function value
        a_vec = a[s, 1:s-1]
        if !iszero(a[s, s:end])
            throw(ArgumentError("Error: this function only supports explicit 
                RK methods, but an implicit coefficient matrix was passed."))
        end
        y_val = currentVal + stepSize * dot(a_vec, k_vals)

        # evaluate ODE
        k_val = ivp.diffEq(time_val, y_val)
        push!(k_vals, k_val)
    end

    # compute weighted sum
    return currentVal + stepSize * dot(b, k_vals)
end
```

The above code implements the formulas from <smart-ref targetId="rk_general" targetType="def"></smart-ref>, which we also explored in-depth in the section on quadrature. We can see that at every step a value $k_s$ is produced with $s \in \\{1, \dots, n\\}$ for an $n$-stage Runge-Kutta method by making a call to `ivp.diffEq` which is the ODE $f(t,y)$. 

At every iteration of the for-loop, we first compute the value $t_i + c_s h$, which is the time-step at which we evaluate the ODE. Next, we retrieve the values from the $[a_{ij}]$ matrix. We also check that this matrix is strictly lower diagonal by calling `iszero()` on the coefficients above or on the diagonal. We then compute a dot-product between the values $a_{ij}$ and the previously computed $k_s$ in order to approximate the value $y(t_i + c_s h)$. Finally, the time-value and approximated $y$-value are used to evaluate the ODE, resulting in the value `k_val`.

Once all values $k_s$ are produced for $s \in \\{1, \dots, n\\}$, we take the dot-product between the weights $b$ and the vector of $k$-values, resulting in the value $y_{i+1}$, which is returned by the function.

Now that everything is in place, it is time to think of some coefficients that our Runge-Kutta method will use. We start with some coefficients for a second order method, called the Midpoint method <smart-cite bibId="wiki_midpoint_method"></smart-cite>:
<display-math>
\begin{array}
{c|cccc}
0\\
\frac{1}{2} & \frac{1}{2}\\
\hline
& 0 & 1
\end{array}
</display-math>

These can neatly be passed to the `solveRungeKuttaExplicit` function. In the following piece of code, we create a function `RK2Midpoint` that creates an `IVPSolver` object. This object contains the solver with the appropriate coefficients, as well as a label `RK2 Midpoint h=$(stepSize)` that will be used during plotting. The refactoring of the code that we did in the <smart-link linkType="int" linkId="solver_interface">previous article</smart-link> is really paying off!
```julia
function RK2Midpoint(stepSize::Float64)
    return IVPSolver(
        ivp -> solveRungeKuttaExplicit(ivp=ivp, stepSize=stepSize, order=2, 
        a=[0 0; 1/2 0],
        b=[0.0, 1.0],
        c=[0.0, 1/2]),
        "RK2 Midpoint h=$(stepSize)"
    )
end
```

For the third order method, we use Kutta's original third order coefficients <smart-cite bibId="kutta1901"></smart-cite>:
<display-math>
\begin{array}
{c|cccc}
0\\
\frac{1}{2} & \frac{1}{2} \\
1           & -1          & 2 \\
\hline
            & \frac{1}{6} & \frac{2}{3} &\frac{1}{6}
\end{array}
</display-math>

The implementation is again very straight-forward:
```julia
function RK3Kutta(stepSize::Float64)
    return IVPSolver(
        ivp -> solveRungeKuttaExplicit(ivp=ivp, stepSize=stepSize, order=3, 
        a=[0 0 0; 1/2 0 0; -1 2 0],
        b=[1/6, 2/3, 1/6],
        c=[0, 1/2, 1]),
        "RK3 Kutta h=$(stepSize)"
    )
end
```

We also add the famous fourth order Runge-Kutta method with classic coefficients <smart-cite bibId="kutta1901"></smart-cite>:
<display-math>
\begin{array}
{c|cccc}
0\\
\frac{1}{2} & \frac{1}{2}\\
\frac{1}{2} &0 &\frac{1}{2} \\
1& 0& 0& 1\\
\hline
& \frac{1}{6} &\frac{1}{3} &\frac{1}{3} &\frac{1}{6} 
\end{array}
</display-math>

These coefficients are also passed in the same way. Note the Julia syntax for encoding a matrix, which uses semi-colons `;` and no commas!
```julia
function RK4Kutta(stepSize::Float64)
    return IVPSolver(
        ivp -> solveRungeKuttaExplicit(ivp=ivp, stepSize=stepSize, order=4, 
        a=[0 0 0 0; 1/2 0 0 0; 0 1/2 0 0; 0 0 1 0],
        b=[1/6, 1/3, 1/3, 1/6],
        c=[0, 1/2, 1/2, 1]),
        "RK4 Kutta h=$(stepSize)"
    )
end
```

## Demonstration

In this last and final chapter, we will apply our code to some initial-value problems and see how well our Runge-Kutta methods solve the IVP. The goal here is to create some plots to answer two research questions:
- RQ1: "What is the effect of the order of the Runge-Kutta method?"
- RQ2: "What is the effect of the step size?"

Note that since we are using explicit Runge-Kutta methods, we will only consider non-stiff problems. We will start with the following initial-value problem <smart-cite bibId="wiki_runge_kutta"></smart-cite>:
<display-math>
\begin{align*}
y'(t) &= \sin(t)^2 \cdot y\\
y(0) &= 1.
\end{align*}
</display-math>

For this IVP we know the exact solution:
<display-math>
y(t) = e^{\frac{1}{2}(t - \cos(t)\sin(t))}.
</display-math>

We first plot forward Euler (i.e., first order Runge-Kutta), the RK2 Midpoint method, and the third-order RK3 method.
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="compare_against_rk3">
            <img src="/assets/images/num_ode/runge_kutta/CompareAgainstRK3.png">
            <figcaption>First, second, and third order RK.</figcaption>
        </figure>
    </div>
</div>

If we compare the curves for step-size $h=0.5$, we see that higher-order methods are always more accurate than lower-order methods, with the points $y_i$ of the third-order method being almost exactly equal to the actual solution.

Also, observe that decreasing the step-size is less effective than increasing the order. If we take RK3 with $h=0.5$ and forward Euler with step-size $h=\frac{0.5}{3}$ we can see that the third-order method is more accurate, even though forward Euler has a smaller time-step.

Also note that RK3 with $h=0.5$ and forward Euler with step-size $h=\frac{0.5}{3}$ both make the same amount of calls to the ODE, since RK3 makes 3 such calls per time-step but forward Euler has a size-size that is 3 times smaller.

We now turn our attention to fourth order Runge-Kutta.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="compare_against_rk4">
            <img src="/assets/images/num_ode/runge_kutta/CompareAgainstRK4.png">
            <figcaption>First and fourth order RK.</figcaption>
        </figure>
    </div>
</div>

We can see that the fourth order RK method aligns nicely with the exact solution both for $h=0.1$ and $h=0.5$. The difference between those two step-sizes seems to be that with $h=0.5$ we get more points. The line for $h=0.1$ seems to deviate a bit from the exact solution, but this is only visual: only the approximated points $(t_i, y_i)$ matter, and those nicely align with the exact solution.

We again compare our higher-order Runge-Kutta method against forward Euler. This time we have $h=0.5$ for RK4 and $h=\frac{0.5}{4}$ for forward Euler. Even though both methods make the same amount of calls to the ODE, the fourth order method is more accurate. Therefore, increasing the order is more effective than using smaller step-sizes.

Before we draw any conclusions, we will also apply our methods to the stable version of the "cosine" IVP <smart-cite bibId="two_ode_examples"></smart-cite> from an <smart-link linkType="int" linkId="forward_euler">earlier article</smart-link>:
<display-math>
\begin{array}{rl}
y'(t) &= - y - \sin(t) + \cos(t), \\
y(0) &= 1.
\end{array}
</display-math>

We plot the forward Euler method with $h=0.5$ and $h=0.1$ as well as second, third, and fourth order Runge-Kutta methods, each with $h=0.5$.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="compare_cosine_stable">
            <img src="/assets/images/num_ode/runge_kutta/CompareRKCosineStable.png">
            <figcaption>Stable cosine ODE.</figcaption>
        </figure>
    </div>
</div>

We can see that for this IVP, all Runge-Kutta methods work quite well. Note that all the markers (i.e., the points for which the Runge-Kutta estimates were actually computed) all nicely align with the exact solution. The forward Euler for $h=0.5$ deviates visibly, and forward Euler with $h=0.1$ deviates a tiny bit.


Likewise, we also apply Runge-Kutta to the unstable version of the IVP <smart-cite bibId="two_ode_examples"></smart-cite>:

<display-math>
\begin{array}{rl}
y'(t) &= y - \sin(t) - \cos(t), \\
y(0) &= 1.
\end{array}
</display-math>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="compare_cosine_unstable">
            <img src="/assets/images/num_ode/runge_kutta/CompareRKCosineUnstable.png">
            <figcaption>Unstable cosine ODE.</figcaption>
        </figure>
    </div>
</div>

Here we see a more pronounced difference. If we look at the estimates for $t=5$ we see that forward Euler with $h=0.1$ does better than forward Euler for $h=0.5$. However, the higher order Runge-Kutta methods all perform better, with a higher order always being more accurate.

We will now answer our research questions. A higher order leads to more accurate results. Similarly, a smaller time-step also leads to more accurate results. The effect of decreasing the time-step has less impact than increasing the order. That is, increasing the order of a method by a factor of four results in a better improvement than decreasing the step-size by a factor of four, for example.

## Conclusion

In this article we covered the explicit Runge-Kutta method. We first saw what this method looks like, and that there actually is a family of different Runge-Kutta methods. We also saw some examples of possible coefficients and how to represent them using Butcher tableaus.

Then, we came up with an intuitive explanation of the fourth order Runge-Kutta method by drawing similarities with the Runge-Kutta method on one hand, and Simpson's rule for numerical quadrature on the other.

Finally, we implemented the Runge-Kutta method for three different orders. We also applied our implementation to three different ODEs and discussed the results. We concluded that while a smaller step-size leads to better results, the order of the Runge-Kutta method is more important. That is, increasing the order of the method has a bigger impact than decreasing the step-size.

For the future I'm interested in implicit Runge-Kutta methods as well as adaptive time-step methods, such as the Runge–Kutta–Fehlberg method. Say tuned!

## References

<bibliography>
</bibliography>
