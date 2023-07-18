<template>
    <div class="landing-page font-sans">
        <Hero></Hero>
        <div class="hero min-h-screen">
            <div class="hero-overlay bg-opacity-10"></div>
            <div class="hero-content text-center text-neutral-content">
                <div class="max-w-md">
                <h1 class="mb-5 text-5xl font-bold text-white lato">Prestanda</h1>
                <h3 class="mb-5 text-4xl font-bold text-white lato">Hiring Done Right.</h3>
                <p class="mb-5 text-white tracking-wide">
                    <b class="text-secondary">Automate first-round phone screenings</b>, saving time and expanding your talent pipeline.
                    Generate <b class="text-secondary">personalized interview questions</b> based on each candidate's resume and target role.
                    Affordable, <b class="text-secondary">comprehensive psychometric assessments</b> deployed earlier for data-driven evaluations.
                    <b class="text-secondary">Reduce bias and promote equal opportunity</b> by focusing on candidate qualities that truly matter.</p>
                <button class="btn btn-primary">Setup A Free Account</button>
                </div>
            </div>
        </div>
        <div class="feature-section hero min-h-screen bg-white">
            <div class="hero-content flex-col lg:flex-row-reverse">
                <div class="flex flex-row flex-wrap items-center">
                    <ProductCard 
                        image="/feature-icon-01.svg" 
                        title="Automated Phone Screening" 
                        blurb="Automated first call phone screening saves you time and mitigates talent pipeline backlogs.">
                    </ProductCard>
                    <ProductCard 
                        image="/feature-icon-02.svg" 
                        title="Targeted Interview Questions" 
                        blurb="Interview questions that are generated from the job description you're hiring for, and each candidates resume.">
                    </ProductCard>
                    <ProductCard 
                        image="/feature-icon-03.svg" 
                        title="Job Fit Analysis" 
                        blurb="Automated job fit recommendations that assess candidate responses as they relate to your job description.">
                    </ProductCard>
                    <ProductCard 
                        image="/feature-icon-04.svg" 
                        title="User-Friendly" 
                        blurb="Easy, simple to use interface that doesnt overwhelm with features. We do what we say, and we do it well!">
                    </ProductCard>
                    <ProductCard 
                        image="/feature-icon-05.svg" 
                        title="No Contracts" 
                        blurb="Pay as you go pricing model, no contracts or obligations (bulk discounts are available upon inquiry).">
                    </ProductCard>
                    <ProductCard 
                        image="/feature-icon-06.svg" 
                        title="ATS Integrations" 
                        blurb="We integrate with your preferred applicant tracking system to help you more easily track and manage your job candidates.">
                    </ProductCard>
                </div>
            </div>
        </div>
        <div class="feature-section hero bg-base-200">
            <div class="hero-content flex-col lg:flex-row text-center">
                <div>
                    <h1 class="mt-5 mb-5 text-5xl font-bold text-white lato">Pricing</h1>
                    <div class="flex flex-row flex-wrap items-center">
                        <div class="mb-4" v-for="(price, p) in priceData" :key="p">
                            <PriceCard 
                                :cta="price.cta" 
                                :title="price.title"
                                :bullets="price.bullets"
                                :link="price.link">
                            </PriceCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const priceData = ref([
    {
        cta: "Get Started",
        title: "Free",
        bullets: [
            "5 Automated screening calls per month",
            "5 Psychometric Assessments per month",
            "Job Fit Recommendations",
            "Psychometric Assessment Reports"
        ],
        link: "/start"
    },
    {
        cta: "Estimate Usage",
        title: "Pay As You Go",
        bullets: [
            "$1.95 per Automated Screening Call",
            "$3.95 per Psychometric Assessment",
            "Job fit recommendations",
            "Psychometric Assessment Reports"
        ],
        link: "/estimate"
    },
    {
        cta: "Inquire for Details",
        title: "Monthly or Annual Commitment",
        bullets: [
            "Discounts applied in per-month increments of 250 Calls or Assessments",
            "As low as $1 per Call Screening",
            "As low as $3 per Psychometric Assessment"
        ],
        link: "/contact"
    },
])

</script>
