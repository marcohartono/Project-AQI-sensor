<template>

    <nav class="navbar">
          <ul>
            <a href="">
                <img src="./assets/logo.png" alt="" height="50" width="50">
            </a>
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/about">About</router-link></li>
            
          </ul>
    </nav>
    <router-view></router-view>
</template>

<script lang="ts">
</script>

