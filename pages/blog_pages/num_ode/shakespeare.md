---
layout: page
title: "Shakespeare's tragedy through the lens of mathematics"
permalink: /posts/num_ode/shakespeare
exclude: true
referenceId: shakespeare
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


## Introduction

Since it has recently been Valentine's Day, we will use the power of love to write an interesting article about mathematics. More precisely, we will take the most famous couple of all, Romeo and Juliet <smart-cite bibId="wiki_romeo_and_juliet"></smart-cite>, and analyse their dynamic with the help of differential equations (ODEs).

I have wanted to write this article for a couple years now and this has been one major reason I decided to study and write about numerical methods for ODEs. A few years ago I watched a very interesting YouTube video by 3Blue1Brown (<smart-link linkType="ext" linkId="yt_video_3b1b">link</smart-link>) where the dynamic between Romeo and Juliet was modelled using differential equations. This, in turn, was inspired by the existing literature on this topic <smart-cite bibId="sprott_rj"></smart-cite><smart-cite bibId="strogatz_rj"></smart-cite>.


In this article, we will first consider what Shakespeare wrote and translate this into a system of differential equations. Then, we will consider phase portraits to visualise the dynamic between Romeo and Juliet. Finally, we will consider a few different scenarios of how Romeo and Juliet feel about each other and analyse the results.

## Overview

<tableOfContents></tableOfContents>


## From Shakespeare to ODEs

From what Shakespeare wrote, we know that Romeo and Juliet hopelessly fall in love with each other when they meet each other at a ball. The fact that Romeo and Juliet belong to families that are each others sworn enemies greatly complicates things, eventually leading to the tragic deaths of both characters <smart-cite bibId="wiki_romeo_and_juliet"></smart-cite>
. 

Even though that is a very sad story, we will have fun playing around with the mathematics behind it. More specifically, we will use mathematics to model various romantic dynamics between Romeo and Juliet. By building such models, we can simulate various scenario's and see how they play out.

In mathematics we use so-called ordinary differential equations (abbreviated as ODEs) to model and analyse dynamical systems. Dynamical systems have multiple components that interact in a complex way. In our case, the "dynamical system" is the romantic interaction between Romeo and Juliet. The components of this system are Romeo and Juliet themselves.

In order to mathematically analyse the interaction between Romeo and Juliet, we will represent their love using numbers. High numbers indicate intense love for the other person, while low numbers represent intense hatred. In order to be more formal, we will represent these quantities using various symbols.

Let the function $R(t)$ be Romeo's love for Juliet at time $t$ and let $J(t)$ be Juliet's love for Romeo at time $t$. For example: if Romeo experiences intense romantic feelings after 3 days ($t=3$), we might say that $R(3) = 9.5$. 

Romeo's love for Juliet at time $t$ is influenced by two factors:
1. his own feelings, given by $R(t)$,
2. Juliets feelings for Romeo, given by $J(t)$.

Simultaneously, Juliet's love for Romeo is influenced by two factors:
1. her own feelings, given by $J(t)$,
2. Romeo's feelings for her, given by $R(t)$.

This mutual interaction can be modeled by the following ODE:

$$
\begin{array}{rl}
\frac{dR(t)}{dt} &= a R(t) + c J(t), \\
\frac{dJ(t)}{dt} &= b R(t) + d J(t).
\end{array}
$$

The symbol $\frac{dR(t)}{dt}$ represents the amount by which Romeo's feelings change (i.e., how much they go up or down). Similarly, $\frac{dJ(t)}{dt}$ describes the change in Juliet's feelings.

The ODE gives values to these symbols. For example, it says that the change in Juliet's feelings $\frac{dJ(t)}{dt}$ is influenced by Romeos's feelings indicated by $R(t)$ as well as her own emotions indicated by $J(t)$. How strong these influences are, is determined by the values of the variables $b$ and $d$, respectively.

For example, if $d$ is very large, then Juliet will mostly listen to her own feelings. If, on the other hand, $b$ is very high, then she will be strongly influenced by Romeo's feelings.

These values can also be negative, however. If $b$ is negative, for example, then she will feel the opposite of Romeo. This means that if Romeo has strong feelings, then she will be repulsed. Alternatively, if Romeo has negative feelings towards her, then this causes Juliet to be strongly attracted to Romeo.

Just like how Juliet's emotional regulation is determined by the values of the symbols $b$ and $d$, Romeo's emotional dynamic is determined by the values of $a$ and $c$. By choosing values for $a$, $b$, $c$, and $d$ we can completely determine how Romeo's and Juliet's emotions influence each other!

## Phase portraits

In the course of this article, we will consider different romantic scenarios for Romeo and Juliet. Each scenario will be visualised with a so-called phase portrait. Since not all readers might be familiar with such diagrams, I will first explain here how to use and read phase portraits. This bit of information is important to understand the rest of the article.

A phase portrait <smart-cite bibId="wiki_phase_portrait"></smart-cite> is a diagram used to visualise the phase space of a dynamical system. Such a diagram illustrates the different configurations of such a system and also how such a system evolves as time passes. These diagrams are widely used in physics and engineering. 

In our case, the phase space of Romeo's and Juliet's relationship is all the possible romantic scenarios and how their relationship evolves in each scenario. We will illustrate this visually in the following figure:

<!-- USED PARAMETERS: a=0.0_b=-2.0_c=-2.0_d=0.0 -->
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="phasePortraitExample">
            <figureImage imgSrc="/assets/images/num_ode/shakespeare/phasePortraitExample.png"></figureImage>
            <figcaption>Example of a phase portrait.</figcaption>
        </figure>
    </div>
</div>

In the figure you can see a horizontal axis (Romeo's love for Juliet) and a vertical axis (Juliet's love for Romeo). The value 10 indicates love, value of 0 means indifference, and a value of -10 signals hate for the other person. 

For example, if we pick the point $(r=-5, j=2)$, then we are considering the situation where where Romeo mildly detests Juliet ($r=-5$) and Juliet is somewhat interested in Romeo $(j=2)$. For clarity, I have marked this point with a black dot in <smart-ref targetType="fig" targetId="phasePortraitExample"></smart-ref>.

Using the figure, we can see how their relationship moves forward in this situation. We can see that the arrows around the point $(r=-5, j=2)$ all go to the top-left. This means that Romeo starts to reject Juliet even more ($r$ decreases), while Juliet is growing more and more in love with Romeo ($j$ increases). Again, for clarity, I have marked this evolution with a black arrow.

Aside from assessing the current situation and how the relationship evolves, we can follow the evolution of their relationship over a longer period. Consider the following figure:

<!-- USED PARAMETERS: a=0.0_b=-2.0_c=-2.0_d=0.0 -->
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="phasePortraitExample2">
            <figureImage imgSrc="/assets/images/num_ode/shakespeare/phasePortraitExample2.png"></figureImage>
            <figcaption>Example of a romantic trajectory.</figcaption>
        </figure>
    </div>
</div>

In order to see how the relationship between Romeo and Juliet evolves over a longer period of time, we can start at a specific point and then follow where the arrows lead us. To illustrate this, a point $(r=8, j=7)$ on the figure has been marked. Additionally, there is a sequence of black arrows starting at that point, and this sequence follows the direction of the colored arrows. Each small black arrow illustrates how much the relationship evolves in, say, a single day. Multiple arrows then indicate an evolution over multiple days.

This means that, assuming this specific phase portrait is correct, when Romeo and Juliet meet and they feel strongly in love with each other, then the following two things happen:
- Juliet's love for Romeo quickly disappears and turns into growing hatred,
- Romeo's love decreases a bit in intensity but then becomes more intense again.

In this scenario, Romeo has clearly done something to make Juliet angry, despite making a good first impression. However, Romeo does not seem to be aware of the effect he has on Juliet and just continues to feel in love.

To summarise: We can use phase portraits to illustrate how a phenomenon evolves as time passes. In the case of Shakespeare, the phase portraits tell us how the relationship between Romeo and Juliet evolves. The horizontal axis describes how Romeo feels and the vertical axis describes Juliet's feelings. The value of 10 indicates intense love, and the value of -10 indicates intense hatred. The arrows indicate, at every situation, how their feelings evolve and where the relationship goes next.

## Interesting cases

We can clearly see that just with this simple formula, we can come up with a large amount of different scenario's by choosing different values for $a$, $b$, $c$, and $d$. In order to keep things manageable, we will choose a number of interesting cases. For every case we will consider the phase portrait as well as other graphs that illustrate how Romeo's and Juliet's feelings evolve as time passes.

More precisely, we will consider the following cases:
- **Escalating attraction-repulsion**: Romeo and Juliet constantly go from positive feelings towards each other to negative feelings towards each other. Not only do these feelings alternate, they also grow increasingly strong.
- **Diminishing attraction-repulsion**: Once more, the feelings between Romeo and Juliet alternate between love and hate. This time however, they eventually lose interest of each other.
- **Escalating mutual feelings**: Romeo and Juliet mirror each other's feelings (i.e., they feel the same way about each other). These feelings also grow increasingly strong, either leading to intense mutual attraction or repulsion. We will see that "love at first sight" is very important here: the way that they feel about each other at the beginning determines the course of their relationship.
- **Gradual loss of interest**: No matter how Romeo and Juliet feel about each other, they gradually lose interest and become indifferent towards each other.

### Escalating attraction-repulsion

In the first scenario, Romeo and Juliet are caught in a spiral of attraction-repulsion. This means that they go back-and-forth between intense love and hate. Additionally, this spiral is escalating: their love and hate is growing strong and stronger. In our ordinary differential equation, this is done with the following values: 
- $a=0.5$: Romeo is somewhat encouraged by his own feelings, 
- $b=2.0$: Juliet is strongly influenced by Romeo's feelings, 
- $c=-2.0$: Romeo is discouraged by Juliet's feelings,
- $d=0.5$: Juliet somewhat follows her own emotions.

The system of ODEs with these parameter values is presented below, for completeness:

$$
\begin{array}{rl}
\frac{dR(t)}{dt} &= 0.5 R(t) - 2.0 J(t), \\
\frac{dJ(t)}{dt} &= 2.0 R(t) + 0.5 J(t).
\end{array}
$$

The dynamic between Romeo and Juliet is illustrated in the following figure:

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="attractionRepulsionIncreasing">
            <figureImage imgSrc="/assets/images/num_ode/shakespeare/attractionRepulsionIncreasing_a=0.5_b=2.0_c=-2.0_d=0.5_streamLines.png"></figureImage>
            <figcaption>Phase space portrait.</figcaption>
        </figure>
    </div>
</div>

We can see that the arrows are always circling and slowly grow outwards. This means that no matter how they initially feel about each other, Romeo and Juliet will get caught up in this escalating spiral dynamic. This is because of the negative value of $c$, which causes Romeo to experience feelings that are opposite to those of Juliet.


We will now perform a simulation where Romeo and Juliet first meet, Romeo has slight feelings for Juliet ($r=2$) and Juliet does not care about Romeo either way ($j=0$). In order to better illustrate the results, we run the experiment using slightly different coefficients: $a=0.1$, $b=2.0$, $c=-2.0$, and $d=0.1$. This does not differ much from the situation in the phase portrait. If we simulate this for 15 days, we get the following result:

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="attractionRepulsionIncreasing_traj">
            <figureImage imgSrc="/assets/images/num_ode/shakespeare/attractionRepulsionIncreasing_a=0.1_b=2.0_c=-2.0_d=0.1_traj.png"></figureImage>
            <figcaption>Evolution of Romeo's and Juliet's feelings.</figcaption>
        </figure>
    </div>
</div>

The blue line represents Romeo, and the orange line represents Juliet. We can see that they both experience alternating feelings and that those feelings become more and more intense. Our interpretation of the phase portrait seems to be correct.

### Diminishing attraction-repulsion

Similar to the previous scenario, Romeo and Juliet are once again alternating between love and hate. This time, however, they eventually lose interest of each other. Mathematically speaking, this situation differs from the previous situation because now the values $a$ and $d$ are negative instead of positive. This means that that Romeo and Juliet are be discouraged by their own feelings instead of encouraged, which leads to those feelings eventually disappearing.

<!-- PARAMETERS a=-0.5_b=-2.0_c=2.0_d=-0.5 -->
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="attractionRepulsionDecreasing">
            <figureImage imgSrc="/assets/images/num_ode/shakespeare/attractionRepulsionDecreasing_a=-0.5_b=-2.0_c=2.0_d=-0.5_streamLines.png"></figureImage>
            <figcaption>Phase space portrait.</figcaption>
        </figure>
    </div>
</div>

This loss of interest is illustrated in the phase portrait by all the spirals that are aimed towards the center, and at the center Romeo and Juliet are completely indifferent towards each other.


If we run a simulation for 10 days, and take $r=2$ and $j=3$ as the starting point, then we see that the feelings do indeed alternate, but that they also fizzle out, as we expect from looking at the phase portrait:

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="attractionRepulsionDecreasing_traj">
            <figureImage imgSrc="/assets/images/num_ode/shakespeare/attractionRepulsionDecreasing_a=-0.5_b=-2.0_c=2.0_d=-0.5_traj.png"></figureImage>
            <figcaption>Evolution of Romeo's and Juliet's feelings.</figcaption>
        </figure>
    </div>
</div>

### Escalating mutual feelings

In the third scenario, Romeo and Juliet amplify each other's feelings with nothing that holds back those feelings. This is illustrated in the following phase portrait:

<!-- a=0.0_b=0.5_c=0.5_d=0.0 -->
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="mutualAttractionNoLimit">
            <figureImage imgSrc="/assets/images/num_ode/shakespeare/mutualAttractionNoLimit_a=0.0_b=0.5_c=0.5_d=0.0_streamLines.png"></figureImage>
            <figcaption>Phase space portrait.</figcaption>
        </figure>
    </div>
</div>

In the top-right quadrant, where Romeo and Juliet love each other, we can see that the arrows point to the top-right, meaning that their love will only increase. In the bottom-left quadrant, where they both hate each other, the arrows point to the bottom-left. This means that their hate continues to increase.

This has the following effects:
- **love at first sight**: if they love each other when they meet, then they grow closer and closer,
- **hate at first sight**: if they do not like each other from the start, then they become each other's worst enemy.

If we look at the colors, we see blue in the middle and red at the edges of the figure. This means that the stronger their feelings are the faster those feelings grow.

We will now consider a specific scenario: love at first sight. For this, we let Romeo and Juliet be mildly attracted to each other: $(r=4, j=2)$.

If we simulate this scenario, we get the following graph that is exponentially increasing:

<!-- a=0.0_b=0.5_c=0.5_d=0.0 -->
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="mutualAttractionNoLimit_traj">
            <figureImage imgSrc="/assets/images/num_ode/shakespeare/mutualAttractionNoLimit_a=0.0_b=0.5_c=0.5_d=0.0_traj.png"></figureImage>
            <figcaption>Evolution of Romeo's and Juliet's feelings.</figcaption>
        </figure>
    </div>
</div>

Even though their initial feelings were quite mild, those feelings quickly become very intense after 10 days. Note that before we put love on a scale from 0 (disinterest) to 10 (intense). In the simulation, the values quickly exceed this range and reach magnitudes in the hundreds!

### Gradual loss of interest

Instead of escalating feelings, we can also let Romeo and Juliet lose interest for each other. Consider the following phase portrait:

<!-- a=-4.0_b=1.0_c=1.0_d=-4.0 -->
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="lossOfInterest">
            <figureImage imgSrc="/assets/images/num_ode/shakespeare/lossOfInterest_a=-4.0_b=1.0_c=1.0_d=-4.0_streamLines.png"></figureImage>
            <figcaption>Phase space portrait.</figcaption>
        </figure>
    </div>
</div>

We can see clearly that all arrows point to the middle. This means that no matter how Romeo and Juliet feel about each other, they eventually lose interest for each other.

To confirm this, we will simulate another scenario where Romeo and Juliet start off with positive feelings toward each other. We can see that these feelings quickly disappear over the course of two days.

<!-- a=-4.0_b=1.0_c=1.0_d=-4.0 -->
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="lossOfInterest_traj">
            <figureImage imgSrc="/assets/images/num_ode/shakespeare/lossOfInterest_a=-4.0_b=1.0_c=1.0_d=-4.0_traj.png"></figureImage>
            <figcaption>Evolution of Romeo's and Juliet's feelings.</figcaption>
        </figure>
    </div>
</div>

## Conclusions

In this short article we used differential equations (ODEs) to build a psychological model to simulate the love and hate between Romeo and Juliet. We saw that even with a very simple formula, we can create a lot of interesting relationship dynamics. To be more precise, we considered a linear ODE and used phase portraits to illustrate the behaviour of the resulting dynamical system.

In the future I am interested in writing more about linear ODEs. Such ODEs are often used to analyse the stability of dynamical systems. This gives rise to an expansive field of research. Additionally, we used phase portraits which are also widely used in physics, control theory, and engineering; so it can be interesting to start visualising various systems from different areas of physics and engineering. Finally, we will have to investigate how to create such phase portraits based on a given system of ODEs. Stay tuned!

## References

<bibliography>
</bibliography>
