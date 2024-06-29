<template>
    <nav class="navbar navbar-light bg-light">
  <a class="navbar-brand" href="#">
    <img src="./assets/logo.png" width="40" height="40" class="d-inline-block align-top" alt="">
  </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">

    <ul class="navbar-nav">
      <li class="nav-item">
        <router-link to="/">Home</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/about">About</router-link>
      </li>
    </ul>
  </div>
  
</nav>

    <!-- <nav class="navbar">
          <ul>
            <a href="">
                <img src="./assets/logo.png" alt="" height="50" width="50">
            </a>
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/about">About</router-link></li>
            
          </ul>
    </nav> -->
    <router-view>
        
    </router-view>
</template>

<script lang="ts">
</script>

