<template>
  <div class="p-4 min-h-screen bg-gray-800 text-gray-300">
    <div class="py-4">
      <HomePage />
      <div class="py-2">
        <div class="flex flex-col items-center">
          <VirtCertificate />
        </div>
      </div>
    </div>
  </div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Merriweather&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Allura&display=swap');
</style>
<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      person: null,
    }
  },
}
</script>
