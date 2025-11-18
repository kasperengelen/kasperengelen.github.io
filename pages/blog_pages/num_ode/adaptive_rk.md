---
layout: page
title: Adaptive-step Runge-Kutta methods
permalink: /posts/num_ode/adaptive_rk
exclude: true
referenceId: adaptive_rk
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

In this article we will explore a family of techniques to numerically solve ordinary differential equations. Such equations are widely used in science and engineering, and find applications in physics, chemistry, biology, and epidemiology <smart-cite bibId="gustafson_diff_eq"></smart-cite>.

These techniques are referred to as <em>adaptive-step</em> Runge-Kutta methods. Each of these methods is based on the Runge-Kutta method that we discussed in the previous article. What these methods do differently, however, is that they make use of <em>adaptive step-sizes</em>, which allows for automatically balancing accuracy and computational efficiency. Given that computational power is limited and that small step-sizes are often needed when solving ODEs, automatically determining the right step-size is crucial. 

Specifically, we will consider the Runge-Kutta-Fehlberg (RKF) technique. This technique was discovered by the German mathematician dr. Erwin Fehlberg while working at NASA in 1969.

From 1937 to 1945 dr. Fehlberg provided numerical calculations to the German military, obtaining his PhD in mathematics in 1942 <smart-cite bibId="nasa_paperclip"></smart-cite>. In 1956 he started to work for the ballistic missile program of the US Army. Then, in 1960, his research group was transferred to NASA. As noted earlier, it is here that he introduced the RKF technique in a 1969 technical report, demonstrating his technique by solving the heat equation <smart-cite bibId="wiki_rkf"></smart-cite>. He retired in 1975 <smart-cite bibId="nasa_paperclip"></smart-cite>.

Because of historical reasons, we should take care to consider the employment of dr. Fehlberg in the Heereswaffenamt <smart-cite bibId="wiki_fehlberg_de"></smart-cite> and Luftwaffe <smart-cite bibId="nasa_paperclip"></smart-cite> during World War Two. These two organisations have been involved in numerous war crimes and crimes against humanity, and these crimes are extensively documented. However, I could **not** find any evidence that dr. Fehlberg personally committed any such crimes during the war. It can be valuable to have a discussion on the moral aspects of being part of the German war machine during World War Two, but this is out of scope of this article. I do, however, invite the reader to learn more about the Second World War, since it is important to remember and learn from the many mistakes and wrongdoings committed during that period. We will now continue discussing numerical methods for solving ODEs.

The idea of adaptive step-sizes seems to be known before the RKF method was introduced. In 1961 a mathematician by the name F. Ceschino wrote a French-language publication on the usage of adaptive time-steps <smart-cite bibId="hairer_vol1"></smart-cite>. Fehlberg specifically contributed the specific fifth-order coefficients that are used in the RKF technique. Other adaptive-step methods are, for example, the Dormand-Prince method <smart-cite bibId="wiki_dormand_prince"></smart-cite> and a method introduced by Tsitouras in 2011 <smart-cite bibId="tsit2011_solver"></smart-cite>. The latter two methods are both available in the <smart-link linkType="ext" linkId="diffeq_home">DifferentialEquations.jl Julia package</smart-link>.

In the rest of the article, we will first explore a high-level pseudocode of an adaptive step-size Runge-Kutta method. Then, we will consider the exact RKF coefficients. Next, we formally motivate the error estimation that is used when computing the optimal step-sizes. Finally, we apply the RKF method to a number of different ODEs.


## Overview

<tableOfContents></tableOfContents>

## Adaptive step-size methods

In this first section we will explore a high-level overview of what an adaptive step-size algorithm would look like <smart-cite bibId="hairer_vol1"></smart-cite> <smart-cite bibId="burden_and_faires"></smart-cite>.

Let us first consider a typical ODE solver algorithm that uses a fixed step-size:
```
solveOde(initCondition, ode, stepSize)
    values = []
    currentValue = initCondition
    foreach step
        nextValue = applyStep(ode, currentValue, stepSize)
        add nextValue to values
        currentValue = nextValue
        increase time with stepSize
    return values
```
The function `solveOde` is more or less a loop that simulates the trajectory of the ODE step by step, starting from the initial condition. At each step a new value is computed based on the old value. The new value is stored, and the time is advanced by a single step size.


In an adaptive time-step algorithm, however, the step size can vary from step to step. We still have a loop that follows the trajectory step by step. The difference is, however, that at every step we also compute a new step-size. This looks as follows:
```
solveOdeAdaptive(initCondition, ode, initStepSize, minStepSize, maxStepSize, desiredError)
    values = []
    currentValue = initCondition
    stepSize = initStepSize
    foreach step
        # compute new value and also adjust the step size
        nextValue, stepSize = applyStepAdaptive(ode, currentValue, stepSize, 
                                    minStepSize, maxStepSize, desiredError)
        add nextValue to values
        currentValue = nextValue
        increase time with stepSize
    return values
```

Notice that we call a function `applyStepAdaptive` that both computes the next value of the trajectory and a new step-size. Let us explore this function in more detail:
```
applyStepAdaptive(ode, oldValue, stepSize, minStepSize, maxStepSize, desiredError)
    repeat:
        nextValue = applyStep(ode, oldValue, stepSize)
        error = estimateError()
        if error >= desiredError
            decrease stepSize

            if stepSize < minStepSize:
                raise exception

            continue  # repeat computation with smaller stepsize

        # if the error is smaller than needed, we can be more efficient
        #   by using bigger step-sizes
        if error < desiredError
            increase stepSize

        # upper limit on step size
        if stepSize > maxStepSize:
            stepSize = maxStepSize
        
        # accept new value
        return nextValue, stepSize
```

What happens in this function, is that we first compute the next value in the trajectory. This can be done by applying the Runge-Kutta formulas. Then, we estimate the error. This error is the difference between the exact solution and the estimated value that was obtained with the Runge-Kutta formulas. Recall that the Runge-Kutta formulas are just an approximation and are therefore not exact.

Using larger step-sizes is more efficient, while smaller step-sizes are more accurate. We thus need to find a balance between accuracy and efficiency. Once the error is estimated, we can do one of three things:
- If the estimated error is too much, then we reject the computed value since it is not accurate enough. We decrease the step-size and repeat the computation to obtain a more precise value.
- Otherwise, if the error is below the error threshold but not much, then we accept the computed value.
- Finally, if the error is far below the error threshold, then we still accept the computed value, but we also increase the step-size in order not to waste computational power in the future.

While the principle above is quite clear, we still need to figure out how exactly to implement this error adjustment mechanism. Concretely, we will need to do three things:
1. compute the next value in the trajectory,
2. estimate the error,
3. adjust the step-size.

The first point is very simple: we will simply use the Runge-Kutta formulas. More specifically, we will compute values $y_1$, $y_2$, ..., $y_i$ based on the initial value $y_0$. Each value $y_i$ corresponds with a time value $t_i$. However, we will do two Runge-Kutta estimations at the same time. For every value $y_i$ we compute, we will also compute a value $z_i$. While both values approximate the exact solution $y(t_i)$ they will both do so with different levels of precision.

For the second point, we will simply estimate the error as $\mathrm{err} = \absLength{z_{i+1} - y_{i+1}}$. While this value might seem very arbitrary, we will later motivate it.

Finally, adjusting the step-size can be done using a value $q > 0$:
<display-math>
q = \sqrt[5]{\frac{\varepsilon}{\absLength{z_{i+1} - y_{i+1}} }}.
</display-math>
The value $q$ is the factor by which we need to scale the step-size $h$ in order to obtain the <em>optimal</em> step-size $h_{\mathrm{opt}}$. The optimal step-size is the one for which we exactly achieve the desired error. A detailed derivation of the formula is given in the text further below.

We also need to make some adjustments to the value $q$ before we can use it. The quantity $\absLength{z_{i+1} - y_{i+1}}$ only approximates the actual error and thus might be off. Therefore, we re-scale the new step-size by a safety factor $f_{\mathrm{safe}} < 1$ to "err on the side of caution" <smart-cite bibId="hairer_vol1"></smart-cite>. Taking this into account, the new step-size is $h_{\mathrm{new}} = f_{\mathrm{safe}} \cdot q \cdot h_{\mathrm{opt}}$.

We do not want the step-size to grow or shrink too fast <smart-cite bibId="hairer_vol1"></smart-cite>. As such, we limit $q$ to the interval $[q_{\mathrm{min}}, q_{\mathrm{max}}]$ using the following formula <smart-cite bibId="hairer_vol1"></smart-cite>
<display-math>
  q_{\mathrm{adjusted}} =  \max\left( q_{\mathrm{min}},  \min\left( q_{\mathrm{max}}, q \right) \right).
</display-math>

Summarising all of the adjustments above. the resulting step-size is thus
<display-math>
h_{\mathrm{new}} = h \cdot f_{\mathrm{safe}} \cdot \max\left( q_{\mathrm{min}},  \min\left( q_{\mathrm{max}}, q \right) \right).
</display-math>

Finally, we will add extra checks to ensure that our step size is always between a minimum and maximum step-size, denoted as $h_{\mathrm{min}}$ and $h_{\mathrm{max}}$, respectively <smart-cite bibId="burden_and_faires"></smart-cite> . The minimum is needed to prevent our algorithm from endlessly trying smaller and smaller step-sizes. The maximum is needed since we wish to compute a certain minimum number of points on the ODE trajectory, and also since large step-sizes might cause us to miss out on important parts of the trajectory.

It is possible to make other adjustments to the $q$ value, however. In Burden and Faires, the step-size is only updated if the change is big enough <smart-cite bibId="burden_and_faires"></smart-cite>. This is done by only taking $q$ into account if it is smaller than 0.1 or bigger than 4. The idea here is to prevent the step-size from being constantly modified with small amounts.

Also, note that our formula contains the fraction $\frac{\varepsilon}{\absLength{z_{i+1} - y_{i+1}} }$. There are multiple ways to rearrange the formula for $q$, which can lead to confusion. In the book by Hairer et al., the errors are first normalised by setting $\mathrm{err} = \frac{\absLength{z_{i+1} - y_{i+1}}}{\varepsilon}$, where $\varepsilon$ is the error tolerance <smart-cite bibId="hairer_vol1"></smart-cite>. The formula for $q$ then becomes:
<display-math>
q = \sqrt[5]{\frac{1}{\mathrm{err}}},
</display-math>
which is equivalent to the formula we are using.

Additionally, our acceptable error threshold only takes into account the <em>absolute</em> error. Hairer provides a formula that also takes into account the <em>relative</em> error <smart-cite bibId="hairer_vol1"></smart-cite>.

## Embedded Runge-Kutta methods

The next step is determining how to compute the values $y$ and $z$. Both $y_i$ and $z_i$ are Runge-Kutta estimates of the solution $y(t_i)$. Their orders differ, however, such that $y_i$ is a fourth-order Runge-Kutta estimation and $z_i$ is a fifth-order Runge-Kutta estimation. It is very important to note that we will be computing $y$ and $z$ using the <em>same coefficients</em>. When two Runge-Kutta methods of different orders make use of the same coefficients, we call it an <em>embedded</em> Runge-Kutta method <smart-cite bibId="wiki_rkf"></smart-cite>.

To obtain $y$ and $z$ we will use the coefficients of the Runge-Kutta Fehlberg (RKF) method <smart-cite bibId="wiki_rkf"></smart-cite><smart-cite bibId="burden_and_faires"></smart-cite>. This involves six stages $k_1, \dots, k_6$. The first five values of $k$ are used to compute the fourth order estimate, and then the full six values are used to compute the fifth order estimate.

In the previous article on Runge-Kutta, we always used methods that had the same number of stages as their order (e.g., a third order method with three stages). Here, however, we note that for a fifth-error method, we need at least six stages. This is due to the constraints on the coefficients for a fifth order method: no five-stage method exists for a fifth-order estimation <smart-cite bibId="butcher_book"></smart-cite><smart-cite bibId="hairer_vol1"></smart-cite>.

Additionally, the first five stages are used to obtain the fourth-order approximation. In theory, we could use a four-stage method here, but the RKF method is made such that the fourth and fifth order approximations re-use each other's values for $k_1, \dots, k_6$, which is more computationally efficient. Probably, it was too hard to find good coefficients that allowed for using a four-stage method for the fourth order approximation and six stages for the fifth order approximation. We are thus using a five-stage method for a fourth order approximation, which is one stage more than what is theoretically required.

The Butcher tableau for the RKF coefficients is as follows <smart-cite bibId="wiki_rkf"></smart-cite><smart-cite bibId="burden_and_faires"></smart-cite>:
<display-math>
\begin{array}
{c|cccc}
0                            \\
\frac{1}{4}   & \frac{1}{4}               \\
\frac{3}{8}   & \frac{3}{32}      & \frac{9}{32}   \\
\frac{12}{13} & \frac{1932}{2197} & -\frac{7200}{2197} & \frac{7296}{2197} \\
1             & \frac{439}{216}   & -8                 & \frac{3680}{513}   & -\frac{845}{4104}  \\
\frac{1}{2}   & -\frac{8}{27}     & 2                  & -\frac{3544}{2565} & \frac{1859}{4104} & -\frac{11}{40} \\
\hline
y & \frac{25}{216} & 0 & \frac{1408}{2565} & \frac{2197}{4101} & -\frac{1}{5} & 0 \\
z & \frac{16}{135} & 0 & \frac{6656}{12825} & \frac{28561}{56430} & -\frac{9}{50} & \frac{2}{55}
\end{array}
</display-math>

If we write these out in full, we get:

<display-math>
\begin{align*}
k_1 &= f(t_i, y_i) \\
k_2 &= f\left(t_i + \frac{1}{4}h, \frac{1}{4} k_1\right)               \\

k_3 &=  f\left(t_i + \frac{3}{8}h, \frac{3}{32} k_1     + \frac{9}{32} k_2\right)  \\

k_4 &=  f\left(t_i + \frac{12}{13}h, \frac{1932}{2197} k_1 -\frac{7200}{2197}k_2 + \frac{7296}{2197} k_3\right)\\

k_5 &=  f\left(t_i + h, \frac{439}{216} k_1  -8    k_2             + \frac{3680}{513}  k_3  -\frac{845}{4104} k_4\right)  \\

k_6 &=  f\left(t_i + \frac{1}{2}h, -\frac{8}{27} k_1    + 2    k_2               -\frac{3544}{2565} k_3 + \frac{1859}{4104} k_4  -\frac{11}{40} k_5 \right)
\end{align*}
</display-math>

<display-math>
\begin{align*}
y_{i+1} &= y_i + h \left(\frac{25}{216} k_1 + \frac{1408}{2565} k_3 + \frac{2197}{4101} k_4  -\frac{1}{5} k_5 + 0 \cdot k_6 \right) \\
z_{i+1} &= y_i + h \left(\frac{16}{135} k_1 + \frac{6656}{12825} k_3 + \frac{28561}{56430} k_4  -\frac{9}{50} k_5 + \frac{2}{55} k_6 \right)
\end{align*}
</display-math>

Note that when computing the value $z_{i+1}$, we do this based on the value $y_i$. The value $z_{i+1}$ is therefore NOT based on $z_i$!

## Error analysis

Earlier we saw the following formula for value $q$ with which we can scale the step-size:
<display-math>
q = \sqrt[5]{\frac{\varepsilon}{\absLength{z_{i+1} - y_{i+1}} }}.
</display-math>

In this section we will motivate this formula by deriving it from first principles. We will mostly be basing ourselves off of Burden and Faires <smart-cite bibId="burden_and_faires"></smart-cite>. During the derivation of the error formulas, we will make use of the <em>order</em> of the Runge-Kutta methods which are used to compute the values $y_{i+1}$ and $z_{i+1}$. To formally define what such an order means, we will first consider Taylor's theorem.

<theorem envId="taylor_theorem_full">
<envName>
Taylor's Theorem, <smart-cite bibId="wiki_taylor_series"></smart-cite>
</envName>

Let $n \geq 1$ be an integer, and let $a \in \mathbb{R}$. Let $y: \mathbb{R} \to \mathbb{R}$ be $n+1$ times differentiable on the closed interval $[t, t + h]$. There exists $\xi \in [t, t + h]$ such that

<display-math>
y(t + h) = y(t) + \sum_{k=1}^{n} \frac{y^{(k)}(t)}{k!}h^k + \frac{y^{(n+1)}(\xi)}{(n+1)!}h^{n+1}.
</display-math>

This sum is called the Taylor expansion of order $n$.

The first $n+1$ terms are called the <em>Taylor polynomial</em> of order $n$. The last term is called the <em>remainder</em>, which is of order $\mathcal{O}(h^{n+1})$ for a Taylor expansion of order $n$.
</theorem>

The theorem above precisely describes what it means to have an $n$-th order approximation of a function. Recall that a Runge-Kutta method produces values $y_i$ that correspond with time values $t_i$ such that $y_i$ approximates the exact function value $y(t_i)$. As part of the error analysis, we will try to analyse how much $y_i$ and $y(t_i)$ differ. More specifically, we will define the <em>order</em> by which these two values differ.

First consider that after $k$ steps of the Runge-Kutta algorithm with step-size $h$, we will have obtained values $y_0, y_1, \dots, y_k$. Let us assume that $y_0 = y(t_0)$, i.e., that our initial condition is precisely correct. The difference $\absLength{y_i - y(t_i)}$ is then referred to as the global error. It is called the <em>global error</em> because all errors up until the $i$-th step are accumulated and taken into account.

Another way to consider the difference between $\absLength{y_i - y(t_i)}$ is to assume the previous value $y_{i-1}$ is exact, i.e., $y_{i-1} = y(t_{i-1})$. In doing so, we are quantifying how much error was introduced in one specific time-step. This is referred to as the <em>local error</em> or <em>local truncation error</em>.

When we talk about the order of an error, we are talking about how this error changes if we change the step-size. That is, we consider the error to the be a function of the step-size $h$. Note that an error of order $\mathcal{O}(h^{n+1})$ is better than an error of order $\mathcal{O}(h^{n})$ since $h^{n+1} < h^{n}$ for $0 < h < 1$. 

When we say that a Runge-Kutta method is of order $n$ we mean that its <em>global</em> error is of order $\mathcal{O}(h^{n})$. This is very important, since if the error of a Runge-Kutta method is $\mathcal{O}(h^{n})$, then the Runge-Kutta method is equivalent to a Taylor approximation of order $\mathcal{O}(h^{n})$. The same is true for the local error: if the local error is $\mathcal{O}(h^{n+1})$, then each <em>step</em> of the Runge-Kutta method is equivalent to a Taylor approximation of order $\mathcal{O}(h^{n+1})$ at that step.

It is known that if the order of the global error is $\mathcal{O}(h^n)$, then the order of the local truncation error is $\mathcal{O}(h^{n+1})$ <smart-cite bibId="hairer_vol1"></smart-cite>. There are multiple ways to demonstrate this. In the earlier article on <smart-link linkType="int" linkId="forward_euler">the forward Euler method</smart-link> we give two proofs, both formal and informal, that the local error is of order $\mathcal{O}(h^2)$ and the global error is of order $\mathcal{O}(h)$. We will not give a general proof here.

The Runge-Kutta method of order $n$ thus approximates the solution with just as much precision as an $n$-th order Taylor polynomial. Each step of the Runge-Kutta method therefore introduces errors of order $\mathcal{O}(h^{n+1})$. That is, each step of the Runge-Kutta method can thus be seen as a $(n+1)$-th order Taylor polynomial:

Since $y$ is a 4-th order Runge-Kutta approximation, we can deduce:
<display-math>
\begin{align*}
y(t_{i+1}) &= y(t_i) + \frac{25}{216} k_1 + \frac{1408}{2565} k_3 + \frac{2197}{4101} k_4  -\frac{1}{5} k_5 + 0 \cdot k_6 + \mathcal{O}(h^5) \\
        &= y(t_i) + \sum_{k=1}^{4} \frac{y^{(k)}(t_i)}{k!}h^k + \mathcal{O}(h^5). \\
\end{align*}
</display-math>

Similarly, since $z$ is a 5-th order Runge-Kutta method:
<display-math>
\begin{align*}
z(t_{i+1}) &= y(t_i) + \frac{16}{135} k_1 + \frac{6656}{12825} k_3 + \frac{28561}{56430} k_4  -\frac{9}{50} k_5 + \frac{2}{55} k_6 + \mathcal{O}(h^6) \\
        &= y(t_i) + \sum_{k=1}^{5} \frac{y^{(k)}(t_i)}{k!}h^k + \mathcal{O}(h^6). \\
\end{align*}
</display-math>

In our adaptive-timestep algorithm we will try to limit the local truncation error of the values $y_i$ produced by the algorithm. (Note that the algorithm also produces values $z_i$, for which we do NOT limit the error!) We use $\tau^y_{i+1}(h)$ to denote the local truncation error of the value $y_{i+1}$, assuming $y(t_i) = y_i$ and timestep $h$. 

Let $T = \sum_{k=1}^{4} \frac{y^{(k)}(t_i)}{k!}h^k$. Some simple arithmetic shows the following:
<display-math>
\begin{align*}
y(t_{i+1}) = y(t_i) + T &+ \tau^y_{i+1}(h) \\
y(t_{i+1}) - y(t_i) - T &= \tau^y_{i+1}(h) \\
y(t_{i+1}) - y_i - T &= \tau^y_{i+1}(h) \\
y(t_{i+1}) - (y_i + T) &= \tau^y_{i+1}(h) \\
y(t_{i+1}) - y_{i+1} &= \tau^y_{i+1}(h) \\
\end{align*}
</display-math>

Similarly, we can show that $\tau^z_{i+1}(h) = y(t_{i+1}) - z_{i+1}$ assuming $y(t_i) = y_i$, where $\tau^z_{i+1}(h)$ is the local truncation error of the fifth-order Runge-Kutta method. Recall that $z_{i+1}$ is computed based on $y_i$ and NOT based on $z_i$.

Since we do not know the exact value of $y(t_{i+1})$, it is necessary to approximate $\tau^y_{i+1}(h)$.
<display-math>
\begin{align*}
\tau^y_{i+1}(h) &= y(t_{i+1}) - y_{i+1} \\
          &= y(t_{i+1}) - z_{i+1} + z_{i+1} - y_{i+1} \\
          &= \tau^z_{i+1}(h) + (z_{i+1} - y_{i+1}) \\
\end{align*}
</display-math>

Since $\tau^y_{i+1}$ is $\mathcal{O}(h^5)$ and $\tau^z_{i+1}$ is only $\mathcal{O}(h^6)$, we must have that the significant part of $\tau^y_{i+1}$ comes from $z_{i+1} - y_{i+1}$. Thus we approximate:

<display-math>
\begin{align*}
\tau^y_{i+1}(h) &= \tau^z_{i+1} + (z_{i+1} - y_{i+1}) \\
                &\approx z_{i+1} - y_{i+1} \\
\end{align*}
</display-math>

Next, we want to see what happens to $\tau^y_{i+1}(h)$ if we slightly modify $h$. This is important, since our goal is to make $h$ smaller or larger such that $\tau^y_{i+1}(h)$ is always below a desired error threshold.

Note that $\tau^y_{i+1}(h)$ is of order $\mathcal{O}(h^5)$, and therefore there exists $C$ independent of $h$ such that
<display-math>
    \tau^y_{i+1}(h) \approx Ch^5.
</display-math>

Now we introduce our scaling factor $q > 0$ such that our new timestep will be $q \cdot h$. We compute:
<display-math>
\begin{align*}
\tau^y_{i+1}(qh) &\approx C(qh)^5 \\
              &= q^5 C h^5 \\
              &\approx q^5 \tau^y_{i+1}(h) \\
              &\approx q^5 (z_{i+1} - y_{i+1})
\end{align*}
</display-math>

We continue by solving this equation for $q$ such that $\tau^y_{i+1}(qh) \leq \varepsilon$:
<display-math>
\begin{align*}
    \tau^y_{i+1}(qh) &\leq \varepsilon \\ 
    q^5 (z_{i+1} - y_{i+1}) &\leq \varepsilon \\ 
    q &\leq \sqrt[5]{\frac{\varepsilon}{\absLength{z_{i+1} - y_{i+1}} }}
\end{align*}
</display-math>

Notice that a number of approximations were used along the way, so we are not limiting the value $\tau^y_{i+1}(h)$ but rather an approximation thereof.

## Implementation in Julia

Implementing the technique is quite straightforward and the full code can be found on <smart-link linkType="ext" linkId="num_ode_code">GitHub</smart-link>. Computing the fourth and fifth order Runge-Kutta estimations is very similar to the code of the previous article. Computing the scale factor $q$ and using it to adjust the step-size $h$ is a matter of implementing the formulas that can be found in the previous sections.

Computing $q$:
<display-math>
q = \sqrt[5]{\frac{\varepsilon}{\absLength{z_{i+1} - y_{i+1}} }}.
</display-math>

Using $q$ to adjust $h$ and obtain the new step-size:
<display-math>
h_{\mathrm{new}} = h \cdot f_{\mathrm{safe}} \cdot \max\left( q_{\mathrm{min}},  \min\left( q_{\mathrm{max}}, q \right) \right).
</display-math>

Finally, combining the Runge-Kutta estimations and error control into an algorithm can be done by following the pseudocodes in section three.

## Experiments

Now that we know how adaptive step-sizes can be used with Runge-Kutta, we can apply this technique to some problems. We will apply it to three different ODEs. For every ODE, we will plot the resulting trajectories and also the step-sizes that were used.

### Logistic equation

The first problem to solve is the logistic equation. This equation describes the growth of a population of animals while taking into account how many animals can be supported by the ecosystem. The full IVP is as follows:
<display-math>
\begin{align*}
y'(t) &= r \cdot y \cdot \left(1-\frac{y}{K}\right), \\
y(0) &= P_0.
\end{align*}
</display-math>

Here, $P_0$ is the initial population at time $t=0$. The quantity $K$ is the capacity which fixes the number of animals that are supported by the ecosystem. Finally, $r$ is the growth-rate.

Luckily, there also exists a closed form solution:
<display-math>
    y(t) = \frac{P_0 K e^{rt}}{(K-P_0) + P_0 e^{rt}}.
</display-math>


<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveLogistic_traj">
            <img src="/assets/images/num_ode/runge_kutta_adaptive/rungeKuttaAdaptiveLogistic_traj.png">
            <figcaption>The Runge-Kutta approximation and the exact solution.</figcaption>
        </figure>
    </div>
</div>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveLogistic_steps">
            <img src="/assets/images/num_ode/runge_kutta_adaptive/rungeKuttaAdaptiveLogistic_steps.png">
            <figcaption>The step-sizes for each iteration.</figcaption>
        </figure>
    </div>
</div>

We can see that in the steepest part of the curve, the algorithm tries to take smaller time-steps. It is also interesting that our initial step size $h=1$ was smaller than the necessary step-size. The algorithm first corrects the step-size by increasing it. Then, it chooses finer steps for the steep part of the curve. Finally, the algorithm settles on a courser step-size as the curve flattens.

### Cosine

Next, we will re-use an initial value problem that we have used in earlier articles <smart-cite bibId="two_ode_examples"></smart-cite>:

<display-math>
\begin{array}{rl}
y'(t) &= - y - \sin(t) + \cos(t), \\
y(0) &= 1.
\end{array}
</display-math>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveCosineStable_traj">
            <img src="/assets/images/num_ode/runge_kutta_adaptive/rungeKuttaAdaptiveCosineStable_traj.png">
            <figcaption>The Runge-Kutta approximation and the exact solution.</figcaption>
        </figure>
    </div>
</div>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveCosineStable_steps">
            <img src="/assets/images/num_ode/runge_kutta_adaptive/rungeKuttaAdaptiveCosineStable_steps.png">
            <figcaption>The step-sizes for each iteration.</figcaption>
        </figure>
    </div>
</div>

We can once again see that the steep parts of the curve require smaller step-size. We can also see that this effect of increasing and decreasing the step-size is periodic.

### A steep curve

For this problem we unfortunately do not have an exact closed-form solution. Still, this nicely illustrates the workings of our algorithm.

The third problem is the initial-value problem given by the following equation <smart-cite bibId="steep_example"></smart-cite>:
<display-math>
\begin{align*}
y'(t) &= e^{t-y\cdot\sin(y)}, \\
y(0) &= 0.
\end{align*}
</display-math>


<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveExp_traj">
            <img src="/assets/images/num_ode/runge_kutta_adaptive/rungeKuttaAdaptiveExp_traj.png">
            <figcaption>The Runge-Kutta approximation and the exact solution.</figcaption>
        </figure>
    </div>
</div>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="rungeKuttaAdaptiveExp_steps">
            <img src="/assets/images/num_ode/runge_kutta_adaptive/rungeKuttaAdaptiveExp_steps.png">
            <figcaption>The step-sizes for each iteration.</figcaption>
        </figure>
    </div>
</div>

Here we can clearly see that the steep section requires significantly smaller step-sizes than the other parts of the curve, just like in the previous two examples.


## Conclusion

In this article we have explored how to numerically solve ODEs with adaptive step-sizes. That is, the time-discretisation happens with step-sizes that can be very small in difficult parts of the solution trajectory and large in easy parts of the trajectory.

We began by developing a high-level pseudocode for such a method, paying attention to error estimation. Then, we explored the exact Runge-Kutta coefficients that can be used for the error estimation. Next, we formally derived the error estimation formula. The developed theory was then implemented in Julia and applied to various ODEs.

We did not explore the Julia code in detail, since it is very similar to the pseudocodes and the Julia code of earlier articles. It can be found on GitHub <smart-link linkType="ext" linkId="num_ode_code">GitHub</smart-link>.

In the future, I will be applying this algorithm to more complicated ODEs and also to systems of ODEs. Stay tuned!


## References

<bibliography>
</bibliography>







