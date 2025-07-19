---
layout: page
title: Forward Euler method
permalink: /posts/num_ode/forward_euler
exclude: true
referenceId: forward_euler
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

Ordinary differential equations (ODEs) are widely used in science and engineering. They can be used to mathematically model various phenomena such as chemical reactions, epidemics, animal populations, and the movement of planets in the solar system <smart-cite bibId="gustafson_diff_eq"></smart-cite>.

The idea behind ODEs is that we model a problem as a rate of change. This can be for example the change in temparature of a chemical system, the rate at which an animal population grows or shrinks, or the speed at which a physical object moves. Solving an ODE then involves finding a mathematical function that corresponds with that rate of change. For example, the ODE could specify the speed of at which a planet moves around the sun, and the solution of that ODE would specify the location of the planet at a specific moment in time. 

The reason why ODEs are so widespread in science, is that for many phenomena their rates of change are well known. For example, the speed of physical objects is well-studied in physics, while the growth of animal populations is well known in biology. To those physicists and biologists it is then of interest to find a mathematical model that gives us the speed of an object or the size of an animal population.

Unfortunately, it turns out that solving differential equations is not easy. In fact, solving them symbolically is often impossible! Since ODEs are of such importance to science and engineering, people have developed alternative methods that do not give us a symbolic solution for ODEs, but that instead allow us to numerically approximate such solutions instead. Finding computationally efficient techniques that accurately solve ODEs is often the only way to work with ODEs.

In this series of articles we will be covering different numerical techniques to approximate solutions of ODEs. In this first article we will formally define differential equations and we will talk about a simple method to approximate solutions of ODEs: the forward Euler method.

In the course of the article we will first give a mathematical description of the so-called <em>initial value problem</em>. We will then define the forward Euler method, and we will consider the theoretical motivations as to why it works. Finally, we will implement the forward Euler method in Julia, and empirically analyse the accuracy of this method.

## Overview

<tableOfContents></tableOfContents>

## Initial value problems

When we say that we want to solve an ODE, we usually mean that we want to solve the initial-value problem for that ODE. To see what this exactly means, we need some definitions.

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

Note that such a differential equation has a bit of a "recursive" nature: in order to compute the derivative of $y$ we need to compute $f(t, y(t))$, which in turn depends on the function $y$.

In this article we only solve first-order ODEs, meaning that the function $y(t) \in \mathbb{R}$ is a scalar and not a vector. It also means that only first-order derivatives are allowed. So-called <em>systems</em> of ODEs and ODEs with higher-order derivatives will be covered in a later article.

<example envId="gustafson_example">
<envName>Initial value problem, from <smart-cite bibId="gustafson_diff_eq"></smart-cite>, example 4.5</envName>
An example of an IVP is the ODE $y' = -y + 1 - t$ together with the initial condition $y(0)=3$. The symbolic solution is $y(t) = 2 - t + e^{-t}$.
</example>

<example envId="ivp2">
<envName>Initial value problem</envName>
An example of an IVP is the ODE $y'(t) = 3t + y(t) + 2.5$ together with the initial condition $y(0)=0.5$. The symbolic solution is $y(t) = 3t + e^{-t} - 0.5$.
</example>

## Forward Euler method

As stated in the introduction, we will be investigating the forward Euler method. This technique was invented by Leonhard Euler in the 18th century <smart-cite bibId="wiki_forward_euler"></smart-cite> and first published in his book <em>Institutionum calculi integralis</em>. The forward Euler method will iteratively approximate the unique solution to an initial value problem (IVP). 

We first give a formal definition:
<definition envId="forward_euler">
<envName>Forward Euler method</envName>
<p>Given are an ODE $y'(t) = f(t, y(t))$ and an initial condition $y(t_0) = y_0$, which together make up an initial value problem. We assume $f$ to be Lipschitz-continuous. Additionally, we select a sufficiently small step size $h$.</p>

<p>
Using an iterative scheme defined as
<display-math>
y_{i+1} = y_i + h f(t_i, y_i),\,\text{with}\,i \in \{0, 1, \dots\},
</display-math> 
we can approximate the unique solution $y(t)$ of the IVP with values $y_i \approx y(t_i)$ and $t_i = t_0 + ih$.
</p>
</definition>

The definition above is the general formulation of the forward Euler method. To make this more concrete, we will apply this method to an initial value problem in <smart-ref targetType="ex" targetId="forward_euler_example"></smart-ref>.

<example envId="forward_euler_example">
<envName>Forward Euler method</envName>

Let us consider an IVP with initial value $y(t_0=0) = -7.0$ and ODE $y'(t) = 6-2t$. We will apply the forward Euler method with step-size $h=1$ for 5 steps with $t_0 = 0, y_0 = -7.0$. We obtain the following values:
\[
\begin{aligned}
y_1 &= y_0 + hf(t_0, y_0) = -7 + 1 \cdot (6 - 2 \cdot 0) = -1 \\
y_2 &= y_1 + hf(t_1, y_1) = -1 + 1 \cdot (6 - 2 \cdot 1) = 3 \\
y_3 &= y_2 + hf(t_2, y_2) = 3 + 1 \cdot (6 - 2 \cdot 2) = 5 \\
y_4 &= y_3 + hf(t_3, y_3) = 5 + 1 \cdot (6 - 2 \cdot 3) = 5 \\
y_5 &= y_4 + hf(t_4, y_4) = 5 + 1 \cdot (6 - 2 \cdot 4) = 3 \\
\end{aligned}
\]
</example>

From <smart-ref targetType="ex" targetId="forward_euler_example"></smart-ref> we can see that the forward Euler method produces step-wise linear approximations of the solution $y(t)$ at every time interval $[t_i, t_{i+1}]$.


Geometrically speaking, the forward Euler method takes a point $(t_i, y_i)$ and draws a line through that point with a slope equal to $f(t_i, y_i)$. The next point $(t_{i+1}, y_{i+1})$ is then taken to be the point on that slope at time $t_{i+1} = t_i + h$. This is visualised in <smart-ref targetId="forward_euler_tangents" targetType="fig"></smart-ref>, where we can see the exact solution $y(t) = -(t - 3)^2 + 2$ in green and the approximation with step-size $h=1$ in blue. The tangents of $y(t)$ can be seen in red, and are equal to $f(t, y(t))$ for $t\in \\{0,1,\dots,5\\}$. It is clear that the slope of the approximation is equal to the tangents.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="forward_euler_tangents">
            <img src="/assets/images/num_ode/forward_euler_tangents.png">
            <figcaption>Plot of the tangents and the forward Euler approximation of the solution.</figcaption>
        </figure>
    </div>
</div>

For completeness, we also apply the forward Euler method with step-size $h=0.1$. The result can be seen in <smart-ref targetId="forward_euler_steps" targetType="fig"></smart-ref>. We can see that the error for $h=1$ is rather large, while the error for $h=0.1$ is much smaller.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="forward_euler_steps">
            <img src="/assets/images/num_ode/forward_euler_steps.png">
            <figcaption>Output of the Forward Euler method with $h=1$ and $h=0.1$.</figcaption>
        </figure>
    </div>
</div>

To conclude, the forward Euler method is a simple method for approximating solutions to initial value problems, with the solution being more accurate for smaller step-sizes.

## Derivation

In the previous section we gave a definition of the forward Euler method and we obtained some visual intuition as to how it works. Since we are interested in the mathematics behind numerical methods, we also wish to know <em>why</em> the forward Euler method approximates solutions of initial-value problems. To that end, we will first derive the method using Taylor series and then derive it using numerical integration.

### Derivation using Taylor series

Let us start by deriving the forward Euler method using Taylor series. The Taylor series approximation of a function $y(t)$ is defined as follows:

<theorem envId="taylor_polynom">
    <envName>First-order Taylor approximation.</envName>
    Let $y(x)$ be a function with derivative $y'(a)$ at $a \in \mathbb{R}$. The first-order Taylor approximation of $y(x)$ is defined as 
    <display-math>
        y(x) = y(a) + y'(a)(x-a) + R_a(x).
    </display-math>

    Here, $R_a(x)$ is the <em>remainder</em>, which is defined as

    <display-math>
        R_a(x) = \frac{f''(\xi)}{2}(x-a)^2,
    </display-math>
    for some real number $\xi \in [a, x]$.
</theorem>

We already see a familiar structure emerging. If we take the initial point to be $a=t_0$, and we evaluate at $x=t_1$, then we also have that $y(a) = y(t_0) = y_0$. We also take $x - a = t_1 - t_0 = h$. Finally, $y'(t_0) = f'(t_0, y_0)$. We then get the following:
<display-math>
y(t_1) = y_0 + hf(t_0, y_0) + R_{t_0}(t_1).
</display-math>
If we ignore the error term $R_{t_0}(t_1)$, we get the first step of the forward Euler method:
<display-math>
y(t_1) \approx y_1 =  y_0 + hf(t_0, y_0).
</display-math>

More generally, we can also derive the $i$-th step of the forward Euler method:
<display-math>
y(t_{i+1}) \approx y_{i+1} = y_i + (t_{i+1} - t_i)y'(t_{i}) =  y_i + hf(t_i, y_i).
</display-math>

We can thus conclude that the forward Euler method consists of iteratively approximating the ODE using a first-order Taylor polynomial. In the literature, the forward Euler method is sometimes also derived using the finite-difference formula. Note that the finite-difference formula is actually a first-order Taylor approximation in disguise!

### Derivation using quadrature

Another, distinct, way to derive the forward Euler method, is by applying quadrature. Quadrature is a technique to numerically approximate integrals. In this case, we will solve the ODE by integrating it, motivated by the fact that $y(t) = y(t_0) + \int_{t_0}^{t} y'(\tau) d\tau$. We will, however, only apply a very simple quadrature technique where we approximate the integral between $t_i$ and $t_{i+1}$ using a rectangle of width $h = t_{i+1} - t_i$ and height equal to $f(t_i, y_i) \approx y'(t_i)$. The idea is that the ODE does not vary too much across the time interval $[t_i, t_{i+1}]$ if we keep the step size $h$ small enough.

Formally, the forward Euler method is derived using quadrature as follows:
<display-math>
\begin{aligned}
y(t_{i+1}) &= y(t_i) + \int_{t_i}^{t_{i+1}} y'(\tau) d\tau \\
&\approx y_i + h f(t_i, y_i)
\end{aligned}
</display-math>

In <smart-ref targetId="forward_euler_quadrature" targetType="fig"></smart-ref> we can see an illustration of this integration process. The green curve on top is the actual ODE given by $f(t, y(t))$. In blue, we can see a line $f(t_i, y_i)$ with which we approximate the ODE. The blue shaded area below $f(t_i, y_i)$ has area $h \cdot f(t_{i}, y_{i})$ and is our approximation of the integral

<display-math>
\int_{t_i}^{t_{i+1}} y'(\tau) d\tau = \int_{t_i}^{t_{i+1}} f(\tau, y(\tau)) d\tau.
</display-math>

The area shaded in red is the error, which is the difference between the exact integral and our approximation.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="forward_euler_quadrature">
            <img src="/assets/images/num_ode/forward_euler_quadrature.png">
            <figcaption>Illustration of the quadrature technique and the error.</figcaption>
        </figure>
    </div>
</div>

To conclude, we can see there is also a clear link between numerically solving ODEs on one hand, and numerical integration techniques on the other.

## Error analysis

Once we have obtained some values $y_i \approx y(t_i)$ using the forward Euler method, we would also like to know how accurate these values are. That is, we will verify how close the computed values $y_i$ are to the exact values $y(t_i)$. We will be basing ourselves off of the book <em>Numerical Analysis</em> by Burden and Faires <smart-cite bibId="burden_and_faires"></smart-cite>, which provides an excellent treatment on the subject.

In this error analysis, we are only taking into account the so-called <em>truncation error</em>. When deriving the forward Euler method, we saw that in every step of the algorithm we are approximating the solution $y$ using its Taylor series. This Taylor series only contained the first two terms, and was therefore not equal to the exact solution. The error induced by throwing away all the higher order terms, is what we call the truncation error. Errors can also be caused by rounding errors (i.e., when performing floating point operations), but those are out of the scope of this article, however.

The truncation error is thus defined as the difference $\absLength{y(t_i) - y_i}$ between the approximation $y_i$ and the exact function value $y(t_i)$ at time $t_i$. Since the forward Euler method is an iterative method, we will need to differentiate between the <em>local</em> truncation error on one hand, and the <em>global</em> truncation error. 

The local error is the error introduced at every iteration. Formally, we assume that the error at the start of the iteration is zero (i.e., $y(t_i) = y_i$), and we wish to know the error at the end of a single iteration, equal to $\absLength{y(t_{i+1}) - y_{i+1}}$ <smart-cite bibId="wiki_trunc_error"></smart-cite>.

In the case of the global error, we wish to know the total error accumulated across all iterations. More formally, we assume that we exactly know the initial value $y_0 = y(t_0)$, and we wish to know the error $\absLength{y(t_i) - y_i}$ <smart-cite bibId="wiki_trunc_error"></smart-cite>.

### Local truncation error

We first consider the local truncation error (LTE). This is the error that our method introduces during a single iteration, assuming perfect knowledge of the actual solution at the previous iteration. More specifically, we will not be computing the actual error but rather an upper-bound on the absolute value of the LTE.



<theorem envId="local_error">
<envName>Local error, from <smart-cite bibId="burden_and_faires"></smart-cite></envName>
We assume that the solution at the start of the $i$-th iteration is exactly known, such that $y(t_i) = y_i$. We also assume that an upper bound $M \geq \absLength{y''(t)}$ exists on the second derivative of the unique solution $y$. Let $h$ be the step size. The error introduced at the $i$-th iteration is bounded as follows:
<display-math>
    \absLength{y(t_{i+1}) - y_{i+1}} \leq \frac{h^2M}{2}.
</display-math>
</theorem>

<proof>
<p>Since the local error characterises the error that is introduced at the $i$-th iteration, we assume here that there is no error at the beginning of the iteration (i.e., $y(t_i) = y_i$).</p>

<p>
    In the forward Euler method, the solution $y$ to the initial value problem, is approximated between $t_i$ and $t_{i+1}$ using a first-order Taylor approximation. From <smart-ref targetId="taylor_polynom" targetType="thm"></smart-ref> we know that 
    <display-math>
        y(t_{i+1}) = y(t_i) + hf(t_i, y(t_i)) + R_{t_i}(t_{i+1}),
    </display-math>
    where $R_{t_i}(t_{i+1})$ is the remainder.</p>

<p>
    If we subtract the first-order approximation from the actual function, we get
    <display-math>
        y(t_{i+1}) - (y(t_i) + hf(t_i, y(t_i))) = R_{t_i}(t_{i+1}),
    </display-math>
    which implies
    <display-math>
        y(t_{i+1}) - y_{i+1} = R_{t_i}(t_{i+1}),
    </display-math>
    due to the way that the forward Euler method is defined in <smart-ref targetType="def" targetId="forward_euler"></smart-ref>.
</p>

<p>
    In <smart-ref targetId="taylor_polynom" targetType="thm"></smart-ref> we saw that the remainder is defined as     
    <display-math>
        R_{t_i}(t_{i+1}) = \frac{y''(\xi)}{2}(t_{i+1} - t_i)^2 = \frac{h^2y''(\xi)}{2},
    </display-math>
    for some real number $\xi \in [t_i, t_{i+1}]$.

    Since we don't know this value $\xi$, we will instead assume there exists an upper-bound $M$ on the absolute value of the second derivative, such that $M \geq \absLength{y''(t)}$ for all $t \in [t_i, t_{i+1}]$. We then get


    <display-math>
        \begin{align*}
        \absLength{R_{t_i}(t_{i+1})} &= \absLength{\frac{h^2y''(\xi)}{2}} = \frac{h^2}{2}\absLength{y''(\xi)} \\
                                     &\leq \frac{h^2}{2}M, \\
        \end{align*}
    </display-math>

    and therefore,

    <display-math>
        \begin{align*}
            \absLength{y(t_{i+1}) - y_{i+1}} &\leq \frac{h^2M}{2} .
        \end{align*}
    </display-math>
</p>

</proof>

To illustrate the LTE bound, we will compute an upper bound on the LTE of an example initial-value problem <smart-cite bibId="two_ode_examples"></smart-cite>.
<example>
<p>Let $y'(t) = f(t, y) = y - sin(t) - cos(t)$ be an ODE and $y(0)=1$ be an initial value. This IVP has the exact solution $y(t) = cos(t)$. We therefore have that $y''(t) = -cos(t)$ with $\absLength{-cos(t)} \leq 1$. Therefore, the local error is bounded as follows:
<display-math>
    \absLength{y(t_{i+1}) - y_{i+1}} \leq \frac{h^2}{2}.
</display-math></p>

<p>If we take step-size $h=0.5$ we get an LTE bound of $0.125$, and with a smaller step-size of $h=0.1$ the error is bounded by $0.005$.</p>
</example>

### Global truncation error

As noted earlier, the global error is the error $\absLength{y_i - y(t_i)}$, assuming the initial value $y_0 = y(t_0)$ is exactly known. The theorem below gives us an upper bound on the global truncation error. This means that it gives us some sort of worst case "maximum" error, such that the actual error is always below this upper bound.

<theorem envId="global_error">
<envName>Global error, from <smart-cite bibId="burden_and_faires"></smart-cite></envName>
Let $y' = f(t,y)$, $y(t_0) = y_0$, and let $f$ be Lipschitz continuous in $y$ with Lipschitz constant $L$. We also assume an upper bound $M \geq \absLength{y''(t)}$ exists on the second derivative of the solution $y$. The following is true for all $i > 0$:
<display-math>
\absLength{y(t_{i}) - y_{i}} \leq \frac{hM}{2L}\left(e^{L(t_{i} - t_0)} - 1\right).
</display-math>
</theorem>
The theorem above says that if (a) our function $f$, which describes our system of ODEs, is Lipschitz-continuous and (b) the second derivative of our solution, denoted as $y''$, has an upper bound, then we also have an upper bound on the error caused by applying the forward Euler method. Below we sketch a formal proof in order to convey some intuition as to why this is true.

This proof is quite elegant, and applies interesting concepts such as the Lagrange remainder for Taylor polynomials and the Lipschitz inequality. In the course of the proof, we will first consider the effect of the local error of each iteration $\\{0, \dots, i\\}$. Then, we show that these errors form a series that conforms to the conditions of <smart-ref targetType="lem" targetId="decreasing_sequence_bound"></smart-ref>. The lemma, in turn, then "marches" the local error bound along each iteration until the final iteration is reached, resulting in a bound on the accumulated errors of all iterations.

In the proof we will be leveraging the following lemma, which provides an upper bound on every element of a series $\\{a_i\\}_{i=0}^k$.

<lemma envId="decreasing_sequence_bound">
    <envName>from <smart-cite bibId="burden_and_faires"></smart-cite></envName>
    Let $s, t > 0$ be positive real numbers, and let $\{a_i\}_{i=0}^k$ be a sequence with $a_0 \geq -t/s$, and 
    <display-math>
        a_{i+1} \leq (1+s) a_i + t,\,\,i \in \{0,1,2, \dots, k-1\}.
    </display-math>
    The following holds:
    <display-math>
        a_{i+1} \leq e^{(i+1)s} \left( a_0 + \frac{t}{s} \right) - \frac{t}{s}.
    </display-math>
</lemma>

A proof of <smart-ref targetType="lem" targetId="decreasing_sequence_bound"></smart-ref> can be found in the book by Burden and Faires <smart-cite bibId="burden_and_faires"></smart-cite>. We are now ready to formally prove <smart-ref targetType="thm" targetId="global_error"></smart-ref>.

<proof>
<envName><smart-ref targetType="thm" targetId="global_error"></smart-ref>, from <smart-cite bibId="burden_and_faires"></smart-cite></envName>

<p>We first characterise what happens to the local error if $\absLength{y(t_i) - y_i} \geq 0$. If we take the difference between $y(t_{i+1})$ and $y_{i+1}$, given by the first-order Taylor polynomial and forward Euler formula, respectively, we get the following:
    <display-math>
    (y(t_{i+1}) - y_{i+1}) = (y(t_i) - y_i) + (hf(t_i, y(t_i)) - hf(t_i, y_i)) + \frac{y''(\xi)}{2}h^2,
    </display-math>
    for some real number $\xi \in [t_i, t_{i+1}]$. Just like in the proof of <smart-ref targetType="thm" targetId="local_error"></smart-ref> we will assume that there exists an upper-bound on the second derivative: $\absLength{y''(t)} \leq M$ for all $t \in [t_i, t_{i+1}]$.

    We also apply the triangle inequality by turning all the differences into absolute values:

    <display-math>
    \absLength{y(t_{i+1}) - y_{i+1}} \leq \absLength{y(t_i) - y_i} + \absLength{hf(t_i, y(t_i)) - hf(t_i, y_i)} + \frac{M}{2}h^2.
    </display-math>

    We then apply a crucial property of Lipschitz continuous functions:
    $\absLength{f(x) - f(y)} \leq L\absLength{x - y}$. The value $L$ is called the <em>Lipschitz constant</em>. The formula then becomes

    <display-math>
    \begin{align*}
    \absLength{y(t_{i+1}) - y_{i+1}} &\leq \absLength{y(t_i) - y_i} + \absLength{hf(t_i, y(t_i)) - hf(t_i, y_i)} + \frac{M}{2}h^2 \\
    &\leq \absLength{y(t_i) - y_i} + hL\absLength{y(t_i) - y_i} + \frac{M}{2}h^2 \\
    &\leq (1+hL) \absLength{y(t_i) - y_i} + \frac{M}{2}h^2
    \end{align*}
    </display-math>
</p>

<p>Now that we have a way of going from $\absLength{y(t_i) - y_i}$ to $\absLength{y(t_{i+1}) - y_{i+1}}$, we can use <smart-ref targetType="lem" targetId="decreasing_sequence_bound"></smart-ref> to "march" this error across all iterations $\{0, \dots, i\}$, resulting in a bound on the accumulated errors. Recall that in order to apply the lemma, we first need to satisfy the following inequality:
<display-math>
a_{i+1} \leq (1+s) a_i + t.
</display-math>
</p>

<p>If we take $s = hL$, $t=\frac{h^2M}{2}$, and $a_i = \absLength{y(t_i) - y_i}$, then we obtain the following:
<display-math>
\absLength{y(t_{i+1}) - y_{i+1}} \leq (1 + hL) \absLength{y(t_i) - y_i}  + \frac{h^2M}{2},
</display-math>
and this holds since we just demonstrated it above.
</p>

<p>Now that we have satisfied the required conditions of <smart-ref targetType="lem" targetId="decreasing_sequence_bound"></smart-ref>, the resulting inequality holds:
<display-math>
a_{i+1} \leq e^{(i+1)s} \left( a_0 + \frac{t}{s} \right) - \frac{t}{s}
</display-math>
If we again take $s = hL$, $t=\frac{h^2M}{2}$, and $a_{i+1} = \absLength{y(t_{i+1}) - y_{i+1}}$, we obtain
<display-math>
\begin{align*}
\absLength{y(t_{i+1}) - y_{i+1}} &\leq e^{(i+1)hL} \left(\frac{h^2M}{2hL} \right) - \frac{h^2M}{2hL} \\
&= \frac{hM}{2L}\left(e^{L(t_{i+1} - t_0)} - 1\right).
\end{align*}
</display-math>
The latter being true since $a_0 = \absLength{y(t_{0}) - y_{0}} = 0$ and also $(i+1)h = (t_{i+1} - t_0)$ due to the fact that 
<display-math>
k\cdot h = (t_{k} - t_{k-1}) + (t_{k-1} - t_{k-2}) + \dots + (t_1 - t_0) = t_k - t_0,
</display-math>
for all integers $k > 0$. We thus have proven the global error bound. Q.E.D.
</p>
</proof>

Just like with the local error, we will once again demonstrate this error bound using an example initial-value problem <smart-cite bibId="two_ode_examples"></smart-cite>.

<example>
<p>Let $y'(t) = f(t, y) = y - sin(t) - cos(t)$ be an ODE and $y(0)=1$ be an initial value. This IVP has the exact solution $y(t) = cos(t)$. We therefore have that $y''(t) = -cos(t)$ with $\absLength{-cos(t)} \leq 1$. Additionally, we have that this ODE is Lipschitz continuous, since $\absLength{\frac{\partial f(t, y)}{\partial y}} = 1$, and therefore also has Lipschitz constant $L=1$ <smart-cite bibId="burden_and_faires"></smart-cite>. Also note that $t_0 = 0$.
</p>


<p>If we put this all together, the global error is bounded as follows:
<display-math>
\absLength{y(t_{i}) - y_{i}} \leq \frac{h}{2}\left(e^{t_{i}} - 1\right).
</display-math></p>

<p>We will now compute some error bounds for solutions with $t \in [0, 10]$. We will use different step-sizes $h \in \{0.001, 0.1, 0.5\}$. In the table we can see that a smaller step-size results in a lower error, but that it is also computationally more intensive due to the higher number of iterations.</p>

<table>
    <thead><tr>
        <th>Step-size</th>
        <th>No of iterations</th>
        <th>$t_i$</th>
        <th>Error $\absLength{y(t_{i}) - y_{i}}$</th>
    </tr></thead>
    <tbody>
        <tr>
            <td>0.5</td>
            <td>2</td>
            <td>1</td>
            <td>0.4295704571147613</td>
        </tr>
        <tr>
            <td>0.5</td>
            <td>4</td>
            <td>2</td>
            <td>1.5972640247326626</td>
        </tr>
        <tr>
            <td>0.5</td>
            <td>10</td>
            <td>5</td>
            <td>36.85328977564415</td>
        </tr>
        <tr>
            <td>0.5</td>
            <td>20</td>
            <td>10</td>
            <td>5506.3664487016795</td>
        </tr>
        <tr>
            <td>0.1</td>
            <td>10</td>
            <td>1</td>
            <td>0.08591409142295225</td>
        </tr>
        <tr>
            <td>0.1</td>
            <td>20</td>
            <td>2</td>
            <td>0.31945280494653255</td>
        </tr>
        <tr>
            <td>0.1</td>
            <td>50</td>
            <td>5</td>
            <td>7.370657955128831</td>
        </tr>
        <tr>
            <td>0.1</td>
            <td>100</td>
            <td>10</td>
            <td>1101.273289740336</td>
        </tr>
        <tr>
            <td>0.001</td>
            <td>1000</td>
            <td>1</td>
            <td>0.0008591409142295226</td>
        </tr>
        <tr>
            <td>0.001</td>
            <td>2000</td>
            <td>2</td>
            <td>0.0031945280494653254</td>
        </tr>
        <tr>
            <td>0.001</td>
            <td>5000</td>
            <td>5</td>
            <td>0.0737065795512883</td>
        </tr>
        <tr>
            <td>0.001</td>
            <td>10000</td>
            <td>10</td>
            <td>11.012732897403358</td>
        </tr>
    </tbody>
</table>

</example>

### Big-O notation

In the literature, the error of numerical methods for solving ODEs is often not given in the form a formula that describes the upper bound on the error, as is the case of <smart-ref targetType="thm" targetId="local_error"></smart-ref> and <smart-ref targetType="thm" targetId="global_error"></smart-ref>. Instead it is given in the so-called <em>big-O notation</em>, such as $\mathcal{O}(h)$ or  $\mathcal{O}(h^2)$, where $h$ is the step-size.

The reason for this is that in some contexts we are not really interested in the exact error. In some cases it may be difficult or even impossible to obtain an exact error bound. Instead, we can use the Big-O notation to characterise what effect the magnitude of the step size $h$ has on the size of the error.

One thing to note is that the Big-O notation is used for different things in different contexts, even though the mathematical definition remains the same. In computer science, the Big-O notation is often used to describe how computationally efficient an algorithm is. Bubble-sort is $\mathcal{O}(n^2)$, for example, while merge-sort is $\mathcal{O}(n \log n)$. Since $n \log n$ is less than $n^2$ for all integers $n > 0$, we thus say that merge-sort is more efficient than bubble-sort. 

In mathematics, when studying Taylor polynomials and differential equations, the big-O notation is used to describe how accurate a certain method is when approximating a function. In our case this would be how accurate the forward Euler method is when approximating the exact solution of an ODE. 

Here, we write $\mathcal{O}(h)$ where $h$ is the step-size of our method. While in computer science we are interested in what happens when $n \to \infty$, in mathematics we are interested in what happens when $h \to 0$. The former is called <em>infinite asymptotics</em>, while the latter is referred to as <em>infinitesimal asymptotics</em> <smart-cite bibId="wiki_big_o"></smart-cite>. In this case, we usually have that $h < 1$, and therefore $h^2 < h$. This why you will often see that in the literature on numerical analysis, it is often said that a method of order $\mathcal{O}(h^2)$ is better than a method of order $\mathcal{O}(h)$, for example.

In order to illustrate this difference, we will plot two curves $f(x) = x$ and $g(x) = x^2$, and compare them for $x < 1$ and $x > 1$. The result can be seen in <smart-ref targetType="fig" targetId="curve_comparison"></smart-ref>. For $x < 1$, we can see that $f$ is higher than $g$. Therefore, as $x$ goes toward 0, we prefer an error on the order of $g$ to errors on the order of $f$. On the other hand, when $x > 1$, we see the opposite: $g$ is higher than $f$. In the case that $x$ goes towards infinity, we thus prefer an algorithmic complexity in the order of $f$ to one in the order of $g$.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="curve_comparison">
            <img src="/assets/images/num_ode/curve_comparison.png">
            <figcaption>Comparison of $f(x) = x$ and $g(x) = x^2$.</figcaption>
        </figure>
    </div>
</div>

Since it is important to be precise when describing mathematical concepts, we give a formal description of the Big-O notation in <smart-ref targetType="def" targetId="big_o_limsup"></smart-ref>.

<definition envId="big_o_limsup">
<envName>Infinitesimal big-O, from <smart-cite bibId="wiki_big_o"></smart-cite></envName>
Let $f(x)$ and $g(x)$ be functions. We then say that $f(x) \in \mathcal{O}(g(x))$ as $x \to 0$ if there exist $c > 0$ and $\delta > 0$ such that 
<display-math>
\absLength{f(x)} \leq c \absLength{g(x)}\,\text{for all}\, 0 < x < \delta.
</display-math>
</definition>

Note that in this definition, we specifically have $x$ going to 0 and not towards infinity. We may thus reasonably assume that $x$ is less than one. Formally, this definition says that if $x$ is sufficiently small (i.e., less than $\delta$), then the function $f$ is bounded by $g$, up to a constant factor $c$. To illustrate this, we will give two small examples.

<example>
<envName>Big-O</envName>
Let $\delta = 1$ and $c = 1$. We then have that $x^2 \in \mathcal{O}(x)$, since $x^2 \leq x$ for all $0 < x < \delta$.
</example>

<example>
<envName>Big-O</envName>
We have that $5x^2 + x^3 \in \mathcal{O}(x^2)$. This is true since if we take $c=6$ and $\delta=1$ we get that $5x^2 + x^3 \leq 6 x^2 $ for all $0 < x < 1$.
</example>


<example>
<envName>Big-O for forward Euler</envName>
<p>Recall that in <smart-ref targetType="thm" targetId="local_error"></smart-ref> we obtained the following bound for the local error:
<display-math>
\absLength{y(t_{i+1}) - y_{i+1}} \leq \frac{h^2M}{2}
</display-math>

We have that $\frac{h^2M}{2} \in \mathcal{O}(h^2)$.</p>

<p>Similarly, we obtained a bound for the global error:
<display-math>
\absLength{y(t_{i}) - y_{i}} \leq \frac{hM}{2L}\left(e^{L(t_i - t_0)} - 1\right),
</display-math>
for which it is true that $\frac{hM}{2L}\left(e^{L(t_i - t_0)} - 1\right) \in \mathcal{O}(h)$. Do note that while an error of order $\mathcal{O}(h)$ might seem small since it is linear in $h$, the global error bound is actually exponential in $t_i - t_0$ and therefore explodes as $t_i$ increases.
</p>
</example>

### Comparing the local and global errors

We can see that the local truncation error of the forward Euler method scales with $\mathcal{O}(h^2)$, while the global error scales with $\mathcal{O}(h)$. The local truncation error comes from <smart-ref targetType="thm" targetId="local_error"></smart-ref>. A formal motivation for the global error is given in <smart-ref targetType="thm" targetId="global_error"></smart-ref>, but here we will attempt a more intuitive explanation.

Let $n$ be the number of iterations, and let $\mathcal{O}(h^2)$ be the size of the local error introduced at every iteration. We then have that the total amount of error scales with $\mathcal{O}(n \cdot h^2)$, since we just add all errors across the different iterations.

<p>The number of steps is given by $n = \frac{t_n - t_0}{h}$, since we integrate the ODE from $t_0$ until $t_n$ in steps of size $h$. This number scales with $\mathcal{O}\left(\frac{1}{h}\right)$. If we combine this with the local truncation error, we get 
<display-math>
\mathcal{O}\left(nh^2\right) = \mathcal{O}\left(\frac{1}{h}h^2\right) = \mathcal{O}(h).
</display-math>
</p>

The Euler method is a <em>first-order method</em>, which means that the local error is of order $\mathcal{O}(h^2)$, and the global error is of order $\mathcal{O}(h)$. Generally, a method with local error $\mathcal{O}(h^{k+1})$ is said to be of the $k$-th order <smart-cite bibId="wiki_forward_euler"></smart-cite>.

In the proof of <smart-ref targetType="thm" targetId="global_error"></smart-ref>, this change from $h^2$ to $h$ is due to <smart-ref targetType="lem" targetId="decreasing_sequence_bound"></smart-ref> where $t$ is divided by $s$.

## Implementation

Now that we fully understand how to apply the forward Euler method and why it works, we will attempt an implementation in the Julia programming language. For an introduction on how to get started with Julia programming, you can read an earlier post with a <smart-link linkType="int" linkId="julia_pkg">tutorial on how to create Julia projects</smart-link>.

The forward Euler method is implemented in a function called `solveForwardEuler`, which we can see below. This function takes an ODE passed through the `diffEq` argument, as well as some parameters `y0` (initial condition), `t0` (initial time), `tn` (end time), and `numSteps` (number of iterations).

Note that we do not specify a step-size $h$ here. This is calculated dynamically as $h = \frac{t_n - t_0}{n}$ where $n$ is the number of steps.

```julia
function solveForwardEuler(diffEq; y0::Float64, t0::Float64, tn::Float64, 
    numSteps::Integer)

    # set some values
    stepSize = (tn-t0)/numSteps
    currentVal::Float64 = y0
    currentTime::Float64 = t0

    # add initial condition to the list of output values
    funcVals = [(currentTime, currentVal)]

    for i in 0:numSteps-1
        # apply forward Euler method formula y_i+1 = y_i + h * f(t_i, y_i)
        currentVal = currentVal + stepSize * diffEq(currentTime, currentVal)

        # increase time from t_i to t_i+1
        currentTime += stepSize

        # store value (t_i+1, y_i+1)
        push!(funcVals, (currentTime, currentVal))
    end

    return funcVals
end
```

The values $y_i \approx y(t_i)$ are stored in the `funcVals` variable and are returned by the function. Each element is a tuple $(t_i, y_i)$. The actual forward Euler method formula is simply implemented as 
```julia
# apply forward Euler method formula y_i+1 = y_i + h * f(t_i, y_i)
currentVal = currentVal + stepSize * diffEq(currentTime, currentVal)
```

The argument `diffEq` is actually a function that takes two arguments `t` and `y`, which are the current time value $t_i$ and  function value $y_i$, respectively. If we wish to find the solution to the IVP given in <smart-ref targetType="ex" targetId="gustafson_example"></smart-ref> , we can define a function:

```julia
function someExample(t, y)
    return -y + 1 - t
end
```

and pass it to our forward Euler implementation as follows:

```julia
solveForwardEuler(someExample, y0=3, t0=0, tn=5, numSteps=10)
```

## Demonstration

We will now consider some initial value problems by way of example. What is interesting about these examples, is that the forward Euler method behaves differently on these two examples even though they both have the exact same solution $\cos(t)$. 

Concretely, we will first consider an <em>unstable</em> ODE <smart-cite bibId="two_ode_examples"></smart-cite>, given by

<display-math>
\begin{array}{rl}
y'(t) &= y - \sin(t) - \cos(t), \\
y(0) &= 1.
\end{array}
</display-math>

In Julia, this IVP can be implemented as follows:

```julia
function exampleODE1(t, y)
    return y - sin(t) - cos(t) 
end
```

We can invoke our hand-written ODE solver by calling

```julia
functionValues = solveForwardEuler(exampleODE1, y0=3, t0=0, tn=5, numSteps=10)
```

and we plot the approximated solution stored in the variable `functionValues` by calling the `plot()` function. Note the usage of the string interpolation operator `$` to add the expression `tn/10` to the string.

```julia
plot(functionValues, label="h=$(tn/10)")
```

We also plot the exact solution $\cos(t)$:
```julia
plot!(cos, 0, 5, label="cos(t)")
```

Next, we consider a <em>stable</em> ODE <smart-cite bibId="two_ode_examples"></smart-cite>, given by

<display-math>
\begin{array}{rl}
y'(t) &= - y - \sin(t) + \cos(t), \\
y(0) &= 1.
\end{array}
</display-math>

In similar fashion to the previous ODE, we can implement this equation in Julia:

```julia
function exampleODE2(t, y)
    return  -y - sin(t) + cos(t)
end
```

and call our solver

```julia
functionValues = solveForwardEuler(exampleODE2, y0=3, t0=0, tn=10, numSteps=20)
```

The plotting is identical to the other ODE, and the exact solution is once again $\cos(t)$.


The plots for the unstable and stable IVPs can be seen in <smart-ref targetType="fig" targetId="ode_example_1"></smart-ref> and <smart-ref targetType="fig" targetId="ode_example_2"></smart-ref>, respectively. Both plots also contain the exact solution $\cos(t)$. For each IVP, the above code was ran with multiple step-sizes. 

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="ode_example_1">
            <img src="/assets/images/num_ode/ForwardEuler1.png">
            <figcaption>Unstable ODE, $t \in [0, 5]$.</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="ode_example_2">
            <img src="/assets/images/num_ode/ForwardEuler2.png">
            <figcaption>Stable ODE, $t \in [0, 10]$.</figcaption>
        </figure>
    </div>
</div>

When looking at the figures, we can conclude three things:
1. a higher step-size leads to more accurate solutions,
2. the solutions of the unstable ODE diverge quickly,
3. the stable ODE admits approximations that are quite accurate, even across a larger time span.


## Conclusion

We have come to the end of this article on how to solve initial value problems using the forward Euler method.

We first explored what initial value problems are and what they have to do with differential equations. We then formally defined the forward Euler method, and derived it using Taylor polynomials as well as quadrature. 

Afterwards we explored ways to estimate the accuracy of the forward Euler method. We defined the difference between the local and global error, and formally proved upper bounds for both. The error analysis was concluded with a section on the big-O notation, which is commonly used in computer science and maths.

After concluding the theory, we moved on to the implementation of the method, by programming it in Julia. This implementation was then applied to two ODEs by way of example to demonstrate the effects of the step-size.

In the future I will be writing more articles on numerical methods for differential equations. Stay tuned!

## References

<bibliography>
</bibliography>
