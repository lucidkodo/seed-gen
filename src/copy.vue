<template lang="pug">
h1 Seed Generator
p Empty databases?
p Use this to generate the data for your projects! #[br] Click #[b Generate Data] to view sample!

#do
  p Project hosted on DigitalOcean #[a(href="https://www.digitalocean.com/docs/app-platform/") App Platform]!
  p Visit #[a(href="https://github.com/lucidkodo/seed-gen", target="_blank") repo] for source code.
  a(href="https://cloud.digitalocean.com/apps/new?repo=https://github.com/lucidkodo/seed-gen/tree/main")
    img(
      src="https://www.deploytodo.com/do-btn-blue.svg",
      alt="Deploy to DO")
</template>

<style lang="sass" scoped>
*
  color: #f6f6f6
  text-align: center
  font-family: Avenir, Helvetica, Arial, sans-serif

#do
  margin-bottom: 30px

p
  line-height: 20px

  & + p
    margin-bottom: 20px
</style>
