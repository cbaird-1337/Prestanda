<template>
    <div class="navbar bg-base-200 z-10">
        <div class="navbar-start">
            <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </label>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-1 shadow bg-base-100 rounded-box w-64">
                <li><a>What We Do</a></li>
                <li>
                <a>Interview Tools</a>
                <ul class="p-2">
                    <li><a>Candidate Summary</a></li>
                    <li><a>Job-Fit Recommendation</a></li>
                    <li><a>Psychometric Assessments</a></li>
                </ul>
                </li>
                <li><a>Blog</a></li>
            </ul>
            </div>
            <a href="/" class="btn btn-ghost normal-case text-2xl lato">
                <img src="/Prestanda-Logo-Transparent.png" class="object-contain" width="150"/>
            </a>
        </div>
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
            <li><a>What We Do</a></li>
            <li tabindex="0">
                <details>
                <summary>Interview Tools</summary>
                <ul class="p-2">
                    <li><a>Candidate Summary</a></li>
                    <li><a>Job-Fit Recommendation</a></li>
                    <li><a>Psychometric Assessments</a></li>
                </ul>
                </details>
            </li>
            <li><a>Blog</a></li>
            </ul>
        </div>
        <div class="navbar-end">
            <a class="btn">Log In</a>
        </div>
    </div>
</template>

<style>
.lato {
    font-family: "Lato";
}
</style>