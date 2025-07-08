---
layout: page
title: Maths and Computation
permalink: /blog/
---

<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_blog_page %}
</div>

<div>
{% include smart_link/load_internal_urls.html %}
</div>

<div class="series-container series-section" id="buildsystems">
    <div class="series-top-layer">
        <div class="series-picture">
            <img src="/assets/images/blog_icons/icon_build_series_bin.png" alt="Build systems">
        </div>
        <div class="series-explanation">
            <h3>Build systems</h3>
            <div class="series-picture-mobile">
                <img src="/assets/images/blog_icons/icon_build_series_bin.png" alt="Build systems">
            </div>
            <p>In this series we explore various build systems. Each tutorial explains how to create a new project, how to add source and test code, and how to compile the project into an executable.</p>
            <ul>
                <li>Swift Package Manager:
                    <smart-link linkType="int" linkId="swift_package_manager">[post]</smart-link>
                    <smart-link linkType="ext" linkId="buildsystems_swift_code">[code]</smart-link></li>
                <li>Java projects with Gradle: 
                    <smart-link linkType="int" linkId="gradle">[post]</smart-link>
                    <smart-link linkType="ext" linkId="buildsystems_gradle_code">[code]</smart-link></li>
                <li>Julia projects with Pkg: 
                    <smart-link linkType="int" linkId="julia_pkg">[post]</smart-link>
                    <smart-link linkType="ext" linkId="buildsystems_julia_code">[code]</smart-link></li>
            </ul>
        </div>
    </div>
    <!-- <div class="series-post-list">

    </div> -->
</div>

<div class="series-container series-section" id="linear_algebra_swift">
    <div class="series-top-layer">
        <div class="series-picture">
            <img src="/assets/images/blog_icons/icon_linalg_swift.png" alt="Linear algebra in Swift">
        </div>
        <div class="series-explanation">
            <h3>Linear algebra using Swift</h3>
            <div class="series-picture-mobile">
                <img src="/assets/images/blog_icons/icon_linalg_swift.png" alt="Linear algebra in Swift">
            </div>
            <p>We cover multiple topics in linear algebra. In each tutorial we first explore the theory behind a technique, and afterwards we implement it using the Swift programming language.</p>
            <ul>
                <li>Matrix class:
                    <smart-link linkType="int" linkId="linalg_matrix_class">[post]</smart-link>
                    <smart-link linkType="ext" linkId="linalg_swift_matrix_code">[code]</smart-link></li>
                <li>Cramer's rule:
                    <smart-link linkType="int" linkId="cramers_rule">[post]</smart-link>
                    <smart-link linkType="ext" linkId="linalg_swift_cramer_code">[code]</smart-link></li>
            </ul>
        </div>
    </div>
</div>

<div class="series-container series-section" id="cordic">
    <div class="series-top-layer">
        <div class="series-picture">
            <img src="/assets/images/blog_icons/icon_cordic.png" alt="CORDIC">
        </div>
        <div class="series-explanation">
            <h3>CORDIC</h3>
            <div class="series-picture-mobile">
                <img src="/assets/images/blog_icons/icon_cordic.png" alt="CORDIC">
            </div>
            <p>The articles below cover various aspects of the CORDIC algorithm. We cover both the theory and the practical implementation of the algorithm. Due to the strong link with trigonometry, we also provide visualisations.</p>
            <ul>
                <li>Sine and Cosine using CORDIC: 
                    <smart-link linkType="int" linkId="cordic_trig_theory">[post]</smart-link></li>
                <li>Implementing CORDIC in Python: 
                    <smart-link linkType="int" linkId="cordic_trig_python">[post]</smart-link>
                    <smart-link linkType="ext" linkId="cordic_trig_python_code">[code]</smart-link></li>
                <li>Visualising CORDIC in Python: 
                    <smart-link linkType="int" linkId="cordic_trig_viz_python">[post]</smart-link>
                    <smart-link linkType="ext" linkId="cordic_trig_viz_code">[code]</smart-link></li>
            </ul>
        </div>
    </div>
</div>

<div class="series-container series-section" id="ode_numeric">
    <div class="series-top-layer">
        <div class="series-picture">
            <img src="/assets/images/blog_icons/num_ode_icon_vector_field.png" alt="ode_numeric">
        </div>
        <div class="series-explanation">
            <h3>Numerical methods for ODEs</h3>
            <div class="series-picture-mobile">
                <img src="/assets/images/blog_icons/num_ode_icon_vector_field.png" alt="ode_numeric">
            </div>
            <p>We explore different methods to numerically solve ordinary differential equations, covering both theory and implementations.</p>
            <ul>
                <li>Intro + Forward Euler's method: 
                    <smart-link linkType="int" linkId="forward_euler">[post]</smart-link>
                    <smart-link linkType="ext" linkId="num_ode_code">[code]</smart-link></li>
                <li>Backward Euler's method: 
                    <smart-link linkType="int" linkId="backward_euler">[post]</smart-link>
                    <smart-link linkType="ext" linkId="num_ode_code">[code]</smart-link></li>
            </ul>
        </div>
    </div>
</div>

<div class="highlight-box-white">
    <h2>Changelog</h2>
    <ul>
        <li>2024-06-09: Added blogpost about the Swift package manager.</li>
        <li>2024-07-05: Added blogpost on coding matrices in Swift.</li>
        <li>2024-07-29: Added blogpost on Cramer's rule.</li>
        <li>2024-09-02: Added blogpost on CORDIC.</li>
        <li>2024-10-01: Added blogpost on Gradle.</li>
        <li>2024-11-27: Added blogpost on creating Julia projects.</li>
        <li>2025-03-01: Added blogpost on the forward Euler method.</li>
        <li>2025-07-08: Added blogpost on the backward Euler method.</li>
    </ul>
</div>
