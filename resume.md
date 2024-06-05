---
layout: page
title: Resume
permalink: /resume/
---
<style> 

    .cv_section {
        border-radius: 20px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        padding: 20px;
        margin-top: 10px;  
    }

    .cv_section h3 {
        font: bold 18px Arial;
		margin-top: 20px;  
		margin-bottom: 0px;  
    }

/*.colored_container { 
	border: 1px solid black; 
		background-color: #e6d5d1;            

	
	} 
	.colored_container_content {
		margin-top: 10px;  
		margin-bottom: 20px;  
		margin-right: 20px;  
		margin-left: 20px; 
	}*/

    .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
    }

    .profile-picture img {
        border-radius: 50%;
        width: 200px;
        height: 200px;
    }

    .about-me {
        text-align: justify;
        margin-top: 20px;
    }

    @media (min-width: 768px) {
        .profile-container {
            flex-direction: row;
            align-items: flex-start;
        }

        .profile-picture {
            flex: 1;
            text-align: center;
        }

        .about-me {
            flex: 2;
            text-align: left;
            margin-top: 0;
            margin-left: 20px;
        }
    }
    .publ_links {
        margin-top: 10px;  
    }

    .button {
        border-radius: 20px;
        font: bold 12px Arial;
        text-decoration: none;
        background-color: #EEEEEE;
        color: #333333;
        padding: 6px 8px 6px 8px;
    }
</style>
<script
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
  type="text/javascript">
</script>


<div class="profile-container cv_section" id="about">
    <div class="profile-picture">
        <img src="/assets/images/profile_picture_20240605.jpeg" alt="Avatar">
    </div>
    <div class="about-me">
        <h2>About Me</h2>
        <p>I'm pursuing a PhD at the University of Antwerp in the lab of Prof. Guillermo A. Pérez. My research focusses on applying techniques from formal methods to reinforcement learning. Aside from research I also teach four courses on compilers, software engineering, and computer architecture.</p>
    </div>
</div>


<div class="cv_section" id="exp">
	<h2>Experience</h2>
	<h3>PhD researcher / Teaching assistant</h3>
	University of Antwerp<br>
	Sep 2022 - Present<br>
	<ul>
		<li>Research in formal methods and reinforcement learning</li>
		<li>Teaching courses on compilers, software engineering, computer architecture</li>
	</ul>
</div>

<div class="cv_section" id="educ">
	<h2>Education</h2>
	<h3>Bachelors in Computer Science</h3>
	University of Antwerp<br>
	Sep 2016 - Feb 2020<br>
        <ul>
        <li>Grade: distinction</li>
        <li>Elective courses on computational biology and applied logic.</li>
    </ul>

	<h3>Masters in Computer Science</h3>
	<i>Specialisation Data Science and AI</i><br>

	University of Antwerp<br>
	Sep 2019 - Jun 2022<br>
    <ul>
        <li>Grade: Great Distinction</li>
        <li>Thesis on Graph-Based Reductions for Parametric and Weighted MDPs.</li>
        <li>Elective courses on neural networks, functional programming, and data science ethics.</li>
    </ul>
</div>

<div class="cv_section">
	<h2 id="publ">Publications</h2>
	<h3>Graph-Based Reductions for Parametric and Weighted MDPs</h3>
    Kasper Engelen, Guillermo A. Pérez, Shisha Rao <br>
    ATVA 2023, vol 1, pp 137–157

    <div class="publ_links">
        <a href="https://arxiv.org/abs/2305.05739" class="button" target="_blank">Arxiv</a>
        <a href="https://link.springer.com/chapter/10.1007/978-3-031-45329-8_7" class="button" target="_blank">Springer</a>
        <a href="https://zenodo.org/records/7915828" class="button" target="_blank">Zenodo</a>
    </div>
</div>
