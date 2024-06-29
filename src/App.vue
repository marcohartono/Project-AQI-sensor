<template>
    <nav class="navbar nav-pills nav-fill bg-light">
    <a class="navbar-brand" href="#">
    <img src="./assets/logo.png" width="50" height="50" class="d-inline-block align-top" alt="">
    </a>
  
  <ul class="nav" style="">
      <li class="nav-item">
        <router-link class="nav-link " to="/">Home</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link " to="/about">About</router-link>
      </li>
    </ul>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon">

    </span>
  </button>
  
</nav>
    <router-view>
        
    </router-view>
</template>

<script lang="ts">
</script>

