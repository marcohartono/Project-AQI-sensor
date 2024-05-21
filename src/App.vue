<template>
  <header>
      <nav>
          <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/about">About</router-link></li>
          </ul>
      </nav>
  </header>
  <div class="container-fluid" id="Hero-section" >
    <h1>Jakarta Air Quality Index</h1>
    <p>Real-time updates on the air you breathe</p>
  </div>
  <router-view>
    
  </router-view>
</template>

<script lang="ts">
</script>

