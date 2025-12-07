---
layout: page
title: Implementing CORDIC in Python
permalink: /posts/cordic/trig_python
referenceId: cordic_trig_python
exclude: true
---

<div>
{% include smart_link/load_internal_urls.html %}
</div>


<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_cordic %}
</div>

## Introduction

The CORDIC algorithm can be used to compute many functions such as sine, cosine, and the exponential function. One of the strengths of this algorithm is that it can be implemented using fixed-point arithmetic and only uses additions and bit-shifts.

In the <smart-link linkType="int" linkId="cordic_trig_theory">previous article</smart-link>, we explored how and why CORDIC works by both describing and proving the algorithm. In this article, however, we will take a more practical approach by implementing the algorithm in Python. First, we implement it in floating-point, then we attempt a fixed-point implementation.

I decided it to do the implementation in Python, since this is my first time implementing the CORDIC algorithm. The reason for this is that Python provides more flexibility and debugging opportunities than the C language, for example.

## Contents

* TOC 
{:toc}

## Floating-point implementation in Python

We will first implement CORDIC using floating-point, even though the CORDIC algorithm is actually meant to operate using fixed-point arithmetic. For prototyping and debugging, **it is recommended to first implement an algorithm in floating-point,** before implementing the final fixed-point version.

Given that we have derived and explored the CORDIC algorithm in the previous article, we already have the formulas needed to update the $x$, $y$, and $\theta$ values. This makes the implementation very easy. For completeness, we recall the pseudocode of the algorithm: 

```
x[0]     = Kn
y[0]     = 0
theta[0] = angle

for i in [0, ..., n-1]:
    if theta[i] >= 0:
        x[i+1]     = x[i]     - (y[i] >> i)
        y[i+1]     = y[i]     + (x[i] >> i)
        theta[i+1] = theta[i] - arctan(2 >> i)
    else:
        x[i+1]     = x[i]     + (y[i] >> i)
        y[i+1]     = y[i]     - (x[i] >> i)
        theta[i+1] = theta[i] + arctan(2 >> i)
```

This easily translates to the following Python code:

```python
def cordic_circ_rot_floating_point(
        angle: float, num_iters: int,
        arctan_values: list[float]) -> (float, float, float):
    """
        Implementation of CORDIC in "circular rotation mode", 
        making use of floating-point multiplication.
    """
    x = get_k_n(n=num_iters)
    y = 0
    theta = angle

    for i in range(num_iters):
        # store old values
        x_old = x
        y_old = y
        theta_old = theta

        # We apply the matrix
        #   /-                      -\
        #   | 1           -+ 2^{-i}  |
        #   | +- 2^{-i}   1          |
        #   \-                      -/
        if theta_old >= 0:
            x = x_old - (y_old * (2 ** (-i)))
            y = y_old + (x_old * (2 ** (-i)))
            theta = theta_old - arctan_values[i]
        else:
            x = x_old + (y_old * (2 ** (-i)))
            y = y_old - (x_old * (2 ** (-i)))
            theta = theta_old + arctan_values[i]

    return x, y, theta
```

As can be seen in the Python code above, we simply encoded the formulas in Python notation, and wrapped them in a for-loop. Note that since we are using floats, we have to multiply by $2^{-i}$ instead of using bit-shifts. Mathematically these two are identical, but the performance implications are different.

The arctangent values are passed as an array of floats called `arctan_values`. Calculating the arctangent values is not "cheating" since we only need to know arctangent of powers of two for a fixed number of iterations $i \in \\{0, \dots, n-1\\}$. The following NumPy code is used to compute these constants beforehand:

```python
def get_angles_floating_point(num_iters: int) -> list[float]:
    """
        Retrieve the angles used in each iteration of the algorithm.
    """
    return [np.arctan(2**(-i)) for i in range(num_iters)]
```

As you might recall from the previous article, we need to initialise our $x$ value using $K_n = \prod_{i=0}^{n-1} \frac{1}{\sqrt{1 + 2^{-2i}}}$. This value can be computed using the following NumPy code:

```python
def get_k_n(n: int) -> float:
    """
        Retrieve the total correction factor for n iterations.
    """
    prod = 1
    for i in range(0, n):
        prod *= 1/np.sqrt(1 + (2 ** (-2*i)))

    return prod
```

We are now ready to launch our CORDIC implementation! In order to compute the sine and cosine of the angle $\theta = 0.945$ in 24 iterations, the algorithm can be called as follows:

```python
n = 24  # number of iterations
angle = 0.945  # input angle

angles = get_angles_floating_point(num_iters=n)
theta_max = sum(angles)

# call to CORDIC routine
x_n, y_n, theta_n = cordic_circ_rot_floating_point(angle=angle, 
    num_iters=n, arctan_values=angles)

# compare the computed values, and the reference values using NumPy
print("x_n    =", x_n)
print("np.cos =", np.cos(angle))

print("y_n    =", y_n)
print("np.sin =", np.sin(angle))
print("")

# print some diagnostic information
print("theta_n                ", theta_n)
print("gamma_{n-1}            ", angles[-1])
print("theta_n <= gamma_{n-1}?", abs(theta_n) <= angles[-1])
print("theta_max              ", theta_max)
```

This then produces the following output. We can see that the result is accurate up until multiple digits after the decimal.

```
x_n    = 0.5857428449743548
np.cos = 0.5857428790182249
y_n    = 0.8104969583911769
np.sin = 0.8104969337878096
```

We also print some diagnostic values. These include the value of $\theta_n$, which is the difference between the input angle and the actual amount of rotations that were performed. The value `gamma` is the $\gamma_{n-1}$ from the previous article. We can see that our implementation satisfies the convergence criterium since $\absLength{\theta_n} \leq \gamma_{n-1}$. The `theta_max` value is the maximum angle that can be approximated in $n=24$ iterations.

```
theta_n                 -4.200369970425704e-08
gamma_{n-1}             1.1920928955078068e-07
theta_n <= gamma_{n-1}? True
theta_max               1.7432865012630505
```

We now have a fully working version of the CORDIC algorithm in Python! We are not yet done, however, since CORDIC is actually meant to operate using fixed-point arithmetic, and the implementation above is only for floating-point.

## Fixed-point implementation

In order to fully make use of the strengths of the CORDIC algorithm, we will attempt a fixed-point implementation.

Let us first explore what a fixed-point number looks like. It is similar to a decimal number, say 3.14, but instead of using digits between 0 and 9, we use binary digits. An example would be $11.001001 \approx 3.14$. More generally we say that a fixed-point binary number of $n$ bits with $k$ bits of precision, is the number $b = b_n \dots b_{k+1}.b_{k} \dots b_1$:

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/fixed_point.png">
            <figcaption>Fixed-point number.</figcaption>
        </figure>
    </div>
</div>

The base-10 value of $b$ is equal to:

$$
\mathrm{base10}(b) = b_n 2^{n-k} + \dots + b_{k+1} 2^0 + b_{k} 2^{-1} + \dots + b_1 2^{-k} = \sum_{i=1}^n b_{i} 2^{i-k-1}.
$$

Since fixed-point numbers are simply strings of binary numbers, we can store them as integers. This allows us to easily implement addition and subtraction using binary adders. Multiplication and division by 2 can also be implemented using bit-shifts. Compare this to floating-point numbers, which require advanced circuitry in order to make arithmetic possible. We can see that fixed-point arithmetic is efficient and easy to implement, which makes this a major advantage of the CORDIC algorithm.

The default `float` type in Python is implemented in floating-point format, so we cannot make use of it in our next implementation. For fixed-point we will instead make use of the `fxpmath` library. A fixed-point number of the type `Fxp` can be constructed from a floating-point value as follows: 

```python
fixed_point_val = Fxp(val, signed, n_word, n_frac)
```

This will create a fixed-point value, such that the total number of bits is equal to `n_word`, the number of bits after the decimal is `n_frac` and the value is equal to `val`. If we set `signed` to true, then we can also represent negative numbers in two's complement. Note that this requires an extra sign-bit, such that the total number of available bits becomes `n_word`-1! The `fxpmath` library also defines addition, subtraction, and shifts for values of the fixed-point type.

The computation of the values for $K_n$ and $\arctan 2^{-i}$ is identical to that for floating-point. The only difference is that these values have to be stored as fixed-point values (i.e., using `Fxp` instead of `float`). The only thing that is left to do, is to adapt the rest of the code to use `Fxp` instead of `float`:

```python
NUM_BITS_WORD = 32
NUM_BITS_FRAC = 30

def cordic_circ_rot_fixed_point(
        angle: float, num_iters: int,
        arctan_values: list[Fxp],
) -> (Fxp, Fxp, Fxp):
    """
        Implementation of CORDIC in "circular rotation mode", 
        making use of fixed-point arithmetic.
    """

    # convert to fixed-point
    x = Fxp(val=get_k_n(n=num_iters), signed=True, n_word=NUM_BITS_WORD, n_frac=NUM_BITS_FRAC)
    y = Fxp(val=0.0, signed=True, n_word=NUM_BITS_WORD, n_frac=NUM_BITS_FRAC)
    theta = Fxp(val=angle, signed=True, n_word=NUM_BITS_WORD, n_frac=NUM_BITS_FRAC)

    for i in range(num_iters):
        x_old = x.copy()
        y_old = y.copy()
        theta_old = theta.copy()

        # We apply the matrix
        #   /-                     -\
        #   | 1           -+ 2^{-i} |
        #   | +- 2^{-i}   1         |
        #   \-                     -/
        if theta_old >= 0:
            # NOTE: we use set_val, since the computed value might have 
            # different precision, and we wish to keep the current precision
            x.set_val(x_old - (y_old >> i))
            y.set_val(y_old + (x_old >> i))
            theta.set_val(theta_old - arctan_values[i])
        else:
            x.set_val(x_old + (y_old >> i))
            y.set_val(y_old - (x_old >> i))
            theta.set_val(theta_old + arctan_values[i])

    # convert back to float
    return x, y, theta
```

We have to keep in mind that `Fxp` is a class type, and not a primitive type such as `float`. This means that in order to duplicate the value, we have to use `.copy()`, and in order to change the value we use `.set_val()`. We set the total number of bits to be 32, stored in the constant `NUM_BITS_WORD`. The number of precision bits is set using `NUM_BITS_FRAC = 30`. This leaves one bit to be used as sign-bit, and one other bit for the value. Note that $x$, $y$ and $\theta$ will always be strictly less than two, and therefore we can afford to use only one bit before the comma.

This function can be called in the same way as `cordic_circ_rot_floating_point`. If we run this, we can see that the output is correct:

```
x_n    = 0.5857428340241313
np.cos = 0.5857428790182249
y_n    = 0.81049694865942
np.sin = 0.8104969337878096
```

Once again, we can print some diagnostic information. We can see that our fixed-point implementation also satisfies the convergence criterium.
```
theta_n                 -4.190951585769653e-08
gamma_{n-1}             1.1827796697616577e-07
theta_n <= gamma_{n-1}? True
theta_max               1.743286482989788
```

## Making the convergence fail

In the previous examples, we used the input angle $\theta = 0.945$. We can see that the maximum possible input angle `theta_max` is equal to $1.743286\dots$. What would happen if we use an angle that is outside of the range $[-1.743286\dots, 1.743286\dots]$? Let us try an angle of 1.80 radians:

```
x_n    = -0.1716360915452242
np.cos = -0.2272020946930871
y_n    = 0.9851604085415602
np.sin = 0.9738476308781951
```

We can see that the values for sine and cosine do not match the correct values computed by NumPy. If we look at the diagnostics,

```
theta_n                 0.05671351682394743
gamma_{n-1}             1.1827796697616577e-07
theta_n <= gamma_{n-1}? False
theta_max               1.743286482989788
```

then we see that the values of `theta_n` and `gamma_{n-1}` do not satisfy the convergence criterium. We can see that the same is true for -1.75 radians:
```
x_n    = -0.1716360915452242
np.cos = -0.17824605564949209
y_n    = -0.9851604085415602
np.sin = -0.9839859468739369

theta_n                 -0.006713517010211945
gamma_{n-1}             1.1827796697616577e-07
theta_n <= gamma_{n-1}? False
theta_max               1.743286482989788
```

## Conclusion

In this article we have explored the implementation details of the CORDIC algorithm. We first implemented the algorithm in Python using floating-point. Once we verified that our implementation makes sense, we re-implemented it in fixed-point using the `fxpmath` library. The code can be found on <smart-link linkType="ext" linkId="code_cordic">GitHub</smart-link>.

We then ran the algorithm for some input values, empirically confirming the convergence properties described in the previous article. For the values in the input domain (i.e., those less than `theta_max`) the algorithm nicely converged to the correct sine and cosine values. For values outside of the domain, the diagnostic information correctly indicated that CORDIC failed to converge.

Even though our algorithm produces the correct output, we are not yet finished. The current text-based output is quite boring. In the next article we will animate the CORDIC algorithm. Stay tuned!
