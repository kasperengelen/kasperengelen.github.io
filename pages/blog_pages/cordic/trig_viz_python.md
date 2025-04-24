---
layout: page
title: Visualising CORDIC in Python
permalink: /posts/cordic/trig_viz_python
referenceId: cordic_trig_viz_python
exclude: true
---

<div>
{% include smart_link/load_internal_urls.html %}
</div>


<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_cordic %}
</div>

## Introduction

In the past two articles we covered the CORDIC algorithm by providing a <smart-link linkType="int" linkId="cordic_trig_theory">theoretical overview</smart-link> as well as a <smart-link linkType="int" linkId="cordic_trig_python">practical implementation</smart-link>. In this article we will extend that implementation in order to render a step-by-step animated visualisation of the CORDIC algorithm.

In what follows, we will first modify our CORDIC routine to store the values of the variables at each iteration. We will then use the Matplotlib library in Python to illustrate each iteration on the unit circle. Finally, we will use some advanced Matplotlib features to animate our drawings and save them as an animated GIF-file. 

## Collecting data

Before we can plot anything, we will first have to collect the necessary data during each iteration. Concretely, we need to store the values of $x$, $y$, and $\theta$ before and after each iteration.

For this purpose, we create the following data structures:
- a tuple `CordicPoint` with members `x`, `y`, and `theta`, that contains the values $x$, $y$ and $\theta$ at a specific point in time,
- a class `CordicStep` that contains the values $x$, $y$, and $\theta$ before and after each iteration. This will allow us to visualise the effect of each rotation.

Tuples with named members can easily be defined using `namedtuple`. The full code is as follows:

```python
CordicPoint = namedtuple('CordicPoint', ['x', 'y', 'theta'])

class CordicStep:
    """
        Represents a single iteration in the CORDIC algorithm:
            - old values (x_i,y_i,theta_i)
            - new values (x_i+1,y_i+1,theta_i+1)
    """
    def __init__(self, before: CordicPoint, after: CordicPoint):
        self.before = before
        self.after = after

    def get_before(self) -> CordicPoint:
        return self.before

    def get_after(self) -> CordicPoint:
        return self.after
```

We now need to instantiate these classes at each iteration and store the values of $x$, $y$, $\theta$. In order to do this, we will modify our CORDIC routine. We will keep track of a list `steps`, and update this list at every iteration.

```python
def cordic_circ_rot_floating_point_animated(
        angle: float, num_iters: int,
        arctan_values: list[float]) -> list[CordicStep]:
    """
        Implementation of CORDIC in "circular rotation mode",
        making use of floating-point multiplication.
    """

    # we track every step of the algorithm, such that we can plot it later
    steps = []

    # ... set up initial values ...

    for i in range(num_iters):

        # ... compute x, y, theta ...

        steps.append(CordicStep(
            before=CordicPoint(x_old, y_old, theta_old),
            after=CordicPoint(x, y, theta)
        ))

    return steps
```

With these modifications, we can now keep track of what our CORDIC implementation does at every step.

## Plotting on the unit circle

Now that we know everything that goes on in our CORDIC routine, we will try to visualise this. Since we are rotating vectors around angles, a natural way to visualise this is to plot these vectors on the unit circle. In what follows we will use the Matplotlib library.

We will begin by creating a new plot. We first construct a figure. This figure has a single subplot, which is represented by an object called `ax` of the type `Axes`. Such an object will allow us to draw lines, circles, and other things on our plot.
```python
fig = plt.figure(figsize=(7, 7))
ax = fig.add_subplot(1, 1, 1)
```

We then proceed by adding some informative things to our plot, that lets the viewer make sense of what is present in the figure. Concretely, we will add the following items:
- x-axis and y-axis,
- the unit circle,
- the target vector, which is the exact vector CORDIC tries to approximate.

Additionally, we will draw, at every iteration, the vector before and after applying the rotation.

### Drawing the unit circle

Matplotlib has built-in tools to draw the axes.

```python
# plot x and y axis
ax.axhline(y=0, color='k')
ax.axvline(x=0, color='k')

# set dimensions
ax.set_xlim([-1.2, 1.2])
ax.set_ylim([-1.2, 1.2])
```

The unit circle itself is plotted by drawing points $(\cos t, \sin t)$ for $t \in \[0, 2\pi\]$:

```python
# plot unit circle:
#   - create a set of points 0, ..., 2*pi
#   - draw points (cos(t), sin(t)) for all these points
t = np.linspace(0, np.pi * 2, 100)
ax.plot(np.cos(t), np.sin(t), linewidth=1)
```

The result can be seen below:

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/unit_circle_empty.png">
            <figcaption>Empty unit circle.</figcaption>
        </figure>
    </div>
</div>


### Drawing vectors

Next, we will draw the target vector, as well as the vectors that differ from iteration to iteration. For this, we will create a function `plot_cordic_step_circ` that will plot a single step of the CORDIC algorithm on a circle. We add the necessary arguments to our function:

```python
def plot_cordic_step_circ(ax: Axes, iter_nr: int, before: CordicPoint, 
    after: CordicPoint, target: CordicPoint):
```

Concretely, these function arguments tell us the following:
- what to draw on (`ax`),
- the iteration number (`iter_nr`),
- the vector before rotating (`before`)
- the vector after rotating (`after`), and finally
- the vector we are approximating (`target`).

We will represent the vectors as arrows. The Matplotlib library has a built-in function called `ax.arrow()` for drawing arrows. We can draw the three vectors as follows:

```python
ax.arrow(0, 0, target.x, target.y, color="green", 
    head_width=0.04, length_includes_head=True)

ax.arrow(0, 0, after.x, after.y, color="black", 
    head_width=0.04, length_includes_head=True)

ax.arrow(0, 0, before.x, before.y, color="gray", 
    head_width=0.04, length_includes_head=True)
```

The above code will draw our target vector in green. The new vector is drawn in black, while the old vector is drawn in gray. This indicates to the viewer how the old vector was transformed into the new one. The result look as follows:

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/arrows_simple.png">
            <figcaption>Illustration of the second iteration ($i=1$).</figcaption>
        </figure>
    </div>
</div>

### Highlighting angles

For better visualisation, we would like to highlight the rotation from the old vector to the new vector. We will add a small bent arrow for this, which can be added using `FancyArrowPatch`. Since this is a bit more complicated, we will make a new function for this:

```python
def draw_rotation(before: CordicPoint, after: CordicPoint):
    # render and add arrow
    patch = patches.FancyArrowPatch(
        posA=(before.x, before.y), posB=(after.x, after.y),
        connectionstyle="arc3,rad=0.2",
        arrowstyle="Simple, head_width=5, head_length=10",
        color="red")
    plt.gca().add_patch(patch)
```

The `arrowstyle` specifies some properties of the size of the arrow. The `connectionstyle` specifies how the arrow is bent, and naturally the `color` makes the arrow red. The result is as follows:

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/arrow_wrong_1.png">
            <figcaption>Illustration of the second iteration ($i=1$).</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/arrow_wrong_2.png">
            <figcaption>Illustration of the third iteration ($i=2$).</figcaption>
        </figure>
    </div>
</div>

Note that the image on the right does not look right. The arrow should always bend away from the origin. For this we need to modify the `rad` property of the `connectionstyle` argument. Depending on whether we rotate clockwise or counter clockwise, we will make the rad argument positive or negative:

```python
def draw_rotation(before: CordicPoint, after: CordicPoint):
    # we bend away from the origin.
    if before.theta > after.theta:
        bend = 0.2
    else:
        bend = -0.2

    # render and add arrow
    patch = patches.FancyArrowPatch(
        posA=(before.x, before.y), posB=(after.x, after.y),
        connectionstyle=f"arc3,rad={bend}",
        arrowstyle="Simple, head_width=5, head_length=10",
        color="red")
    plt.gca().add_patch(patch)
```

We can now see that the result is correct, regardless of the direction of the rotation:

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/arrow_correct_1.png">
            <figcaption>Illustration of the second iteration ($i=1$).</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/arrow_correct_2.png">
            <figcaption>Illustration of the third iteration ($i=2$).</figcaption>
        </figure>
    </div>
</div>

### Text

The viewer might also be interested in the error between the actual sine and cosine and the approximated values at each iteration. Therefore, we will add some text to our plot that contains the following information:
- difference between the angle of the target, and the currently approximated angle,
- difference between the target sine and current sine, 
- difference between the target and current cosine, and
- the number of the current iteration.

Text can easily be added using the `ax.text()` method. We will first create the text we wish to add. Note that the `:.2f` here means that we wish to display floating point numbers with two digits after the decimal dot. The `f` at the beginning of the string indicates we are using so-called f-strings.
```python
text = ""
text += f"E. angle: {abs(after.theta - target.theta):.2f}\n"
text += f"E. cos: {abs(after.x - target.x):.2f}\n"
text += f"E. sin: {abs(after.y - target.y):.2f}\n"
text += f"Iteration: {iter_nr}"
```

Adding the text to the plot is done as follows:
```python
ax.text(0.65, 0.87, text, fontsize=12, bbox={"facecolor": 'red', "alpha": 0.5})
```

This means that the character at the bottom-left of the text is located at the coordinate (0.65, 0.87). The font will have size 12 and will have a light red background. The result looks as follows:

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/with_text_0.png">
            <figcaption>Illustration of the first iteration ($i=0$).</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/with_text_1.png">
            <figcaption>Illustration of the second iteration ($i=1$).</figcaption>
        </figure>
    </div>
</div>


## Animated plots

We now have a way to draw every iteration of the CORDIC algorithm. However, we can only produce still images, which is a bit boring. In order to make it more interesting, we will now turn our images into an animated GIF-image.

Concretely, we will make a function `plot_steps_circ_animated` that takes all the steps of the CORDIC algorithm, as well as a target vector, and renders the steps as a GIF-file.

The basic structure of our function will look as follows:

```python
def plot_steps_circ_animated(steps: list[CordicStep], target: CordicPoint):
    fig = plt.figure(figsize=(7, 7))
    ax = fig.add_subplot(1, 1, 1)

    # compute the number of steps
    num_frames = ...

    def animate(frame_nr):
        # start with an empty plot
        ax.clear()

        # ... draw a step of the animation ...

    fig.tight_layout()  # remove margins
    ani = FuncAnimation(fig, animate, frames=num_frames)
    ani.save("filename.gif", dpi=150, writer=PillowWriter(fps=2))
```

The above code will create a `FuncAnimation` object that animates whatever is drawn on the figure `fig`. At every frame it will call a function `animate`, which will draw on the figure. The total number of frames is specified by the `frames` argument.

In the line below, the figure is saved as a GIF file. The `dpi` argument specifies the resolution, while the `fps` argument allows us to set the speed with which the GIF file will play.

In our animation we will draw one iteration after another. For each iteration we will draw two frames: one frame before the rotation, and one frame after the rotation. The total number of frames is thus
```python
num_frames = len(steps) * 2
```

The drawing at each iteration will be done by simply calling the `plot_cordic_step_circ(ax, iter_nr, before, after, target)` function we created before. The `ax` is the Axes of the figure which we pass to the animation. The `iter_nr` is simply the frame number divided by two, since we have two frames per iteration.

For the `before` and `after` arguments, we have to retrieve the right vectors for each iteration:
```python
iter_nr = frame_nr // 2
step = steps[iter_nr]
after = step.get_after()

if frame_nr % 2 == 0:
    # the "before" frame where both the old and new vectors are displayed
    before = step.get_before()
else:
    # only display the result after the rotation
    before = None
```

In the code above we first retrieve the vectors of the correct step of the CORDIC algorithm, by dividing the frame number by two. Next, we use `get_after` to retrieve the vector after the rotation, and `get_before` to get the original vector from before the rotation.

Note that the if-statement enables us to draw two different frames for each CORDIC iteration. In the first frame (even frame numbers 0, 2, 4, ...) we draw both the old vector and the new vector. In the second frame (uneven frame numbers 1, 3, 5, ...), we only draw the new vector, setting the old vector to `None`. 

Though it is not be shown here, this does require a small modification to the `plot_cordic_step_circ` function, where the `before` argument is now of the type `Optional[CordicPoint]`, indicating that it might be `None`. Some small if-statements have to be added as well.

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/animated_no_pause.gif">
            <figcaption>Animated.</figcaption>
        </figure>
    </div>
</div>


Finally, it might be easier for the viewer if the animation pauses at the initial vector, before the first iteration. This allows the viewer the look at the different parts of the plot before the animation starts. Let us take the first four frames, and use them to render the initial vector. In order to implement this, we will subtract the frame number by 4, and add a small if-statement to take this case into account. We also modify the total number of frames.

```python
num_initial_frames = 4
num_frames = (len(steps) * 2) + num_initial_frames

def animate(frame_nr):
        # clear the drawing
        ax.clear()

        # first four frames
        frame_nr = frame_nr - num_initial_frames  

        if frame_nr < 0:
            # one of the "initial" frames.
            iter_nr = 0
            step = steps[iter_nr]

            # only plot the "before" vector as the current vector.
            after = step.get_before()

            # no gray vector needed
            before = None
        else:
            # normal frame:
            iter_nr = frame_nr // 2
            step = steps[iter_nr]
            after = step.get_after()

            if frame_nr % 2 == 0:
                # the "before" frame where both the old and new vectors are displayed
                before = step.get_before()
            else:
                # only display the result after the rotation
                before = None

        plot_cordic_step_circ(iter_nr=iter_nr, ax=ax, before=before, after=after, target=target)
```

In the result below, there is a noticeable pause before the first iteration:


<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/cordic/animated_with_pause.gif">
            <figcaption>Animated with pause.</figcaption>
        </figure>
    </div>
</div>

## Conclusion

In this article we visualised and animated the CORDIC algorithm using the Matplotlib library in Python. We first illustrated individual iterations by drawing the different vectors and rotations. Afterwards we used more advanced Matplotlib features to animate the iterations and save that animation as a GIF file. The code can be found on <smart-link linkType="ext" linkId="code_cordic">GitHub</smart-link>.

This is the third article in my series on the CORDIC algorithm, with previous articles covering the <smart-link linkType="int" linkId="cordic_trig_theory">theory</smart-link> and <smart-link linkType="int" linkId="cordic_trig_python">implementation</smart-link> of CORDIC. Since the CORDIC algorithm can do much more than just trigonometry, I plan on writing more articles on this topic in the future. Stay tuned!
