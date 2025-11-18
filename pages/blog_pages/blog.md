---
layout: page
title: Maths and Computation
permalink: /blog/
referenceId: blog_overview
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
            <ul class="blogpost-list">
            {% include blogpost_list_entry.html title="Swift Package Manager" post_url_id="swift_package_manager" code_url_id="buildsystems_swift_code"%}
            {% include blogpost_list_entry.html title="Java projects with Gradle" post_url_id="gradle" code_url_id="buildsystems_gradle_code" %}
            {% include blogpost_list_entry.html title="Julia projects with Pkg" post_url_id="julia_pkg" code_url_id="buildsystems_julia_code" %}
            </ul>
        </div>
    </div>
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
            <ul class="blogpost-list">
            {% include blogpost_list_entry.html title="Matrix class" post_url_id="linalg_matrix_class" code_url_id="linalg_swift_matrix_code"%}
            {% include blogpost_list_entry.html title="Cramer's rule" post_url_id="cramers_rule" code_url_id="linalg_swift_cramer_code" %}
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
            <ul class="blogpost-list">
            {% include blogpost_list_entry.html title="Sine and Cosine using CORDIC" post_url_id="cordic_trig_theory" %}
            {% include blogpost_list_entry.html title="Implementing CORDIC in Python" post_url_id="cordic_trig_python" code_url_id="cordic_trig_python_code" %}
            {% include blogpost_list_entry.html title="Visualising CORDIC in Python" post_url_id="cordic_trig_viz_python" code_url_id="cordic_trig_viz_code" %}
            </ul>
        </div>
    </div>
</div>

<div class="series-container series-section" id="ode_numeric">
    <div class="series-top-layer">
        <div class="series-picture">
            <img src="/assets/images/blog_icons/num_ode_icon_vector_field.png" alt="Numerical methods for ODEs">
        </div>
        <div class="series-explanation">
            <h3>Numerical methods for ODEs</h3>
            <div class="series-picture-mobile">
                <img src="/assets/images/blog_icons/num_ode_icon_vector_field.png" alt="Numerical methods for ODEs">
            </div>
            <p>We explore different methods to numerically solve ordinary differential equations, covering both theory and implementations.</p>
            <ul class="blogpost-list">
            {% include blogpost_list_entry.html title="Intro + Forward Euler's method" post_url_id="forward_euler" code_url_id="num_ode_code" %}
            {% include blogpost_list_entry.html title="Backward Euler's method" post_url_id="backward_euler" code_url_id="num_ode_code" %}
            {% include blogpost_list_entry.html title="An interface for ODE solvers" post_url_id="solver_interface" code_url_id="num_ode_code" %}
            {% include blogpost_list_entry.html title="Runge-Kutta methods" post_url_id="runge_kutta" code_url_id="num_ode_code" %}
            {% include blogpost_list_entry.html title="Adaptive-step Runge-Kutta" post_url_id="adaptive_rk" code_url_id="num_ode_code" %}
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
        <li>2025-07-19: Added blogpost on a user-friendly interface for ODE solvers.</li>
        <li>2025-08-29: Added blogpost on Runge-Kutta methods.</li>
        <li>2025-11-18: Added blogpost on the Runge-Kutta-Fehlberg method.</li>
    </ul>
</div>
