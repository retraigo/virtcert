<template>
  <div class="p-4">
    <div
      :class="`inset-0 w-full fixed h-full z-30 block ${
              (dropOpen) ? 'visible bg-gray-100 bg-opacity-10' : 'invisible'
            }`"
      @click="toggleOff"
    ></div>
    <div class="py-4 flex flex-col items-center space-y-4">
      <label for="username">Generate Your Certificate</label>
      <div class="flex flex-row items-center space-x-2">
        <div class="py-2 relative">
          <input
            v-model="username"
            placeholder="Your Name"
            @input="toggleDrop"
            id="username"
            type="text"
            class="w-full md:w-72 h-12 p-2 bg-gray-900 border border-gray-300"
          />
          <div :class="`${dropOpen ? 'block' : 'hidden'} overflow-y-scroll max-h-64 absolute z-40 flex flex-col w-full md:w-72 bg-gray-700 p-2`">
            <div
              v-for="person in persons.filter(x => x.name.toLowerCase().includes(username ? username.toLowerCase() : '') || x.organization.toLowerCase().includes(username ? username.toLowerCase() : '') || x.paper_id.toString().toLowerCase().includes(username ? username.toLowerCase() : ''))"
              :key="person.name + person.paper_id"
              class="p-2 cursor-pointer transition duration-500 ease-in-out bg-gray-700 hover:bg-blue-700"
              @click="x => {setName(person);toggleOff()}"
            >
              <span>{{person.paper_id}} - {{person.name}}</span>
            </div>
          </div>
        </div>
        <button
          class="px-4 h-8 py-1 bg-blue-500 text-white rounded-2xl transition duration-500 ease-in-out transform hover:translate-y-1"
          @click="reloadCanvas"
        >Generate</button>
      </div>
      <a
        class="block px-4 h-8 py-1 bg-blue-500 text-white rounded-2xl transition duration-500 ease-in-out transform hover:scale-110"
        :disabled="disableDownload()"
        :href="canvasURL"
        :download="`CERTIFICATE_2022_IVCMASM_${user.name.toUpperCase().replace(/[^a-z\s]/gi, '').replace(/\s/g, '_')}.png`"
      >Download</a>
      <canvas
        ref="cert"
        class="hidden"
        height="1131px"
        width="1600px"
      />
      <img
        :src="canvasURL"
        class="w-full md:max-w-2xl"
      />
    </div>
  </div>
</template>
 <style>
@import url('https://fonts.googleapis.com/css2?family=Parisienne&display=swap');
</style> 
<script>
import persons from '@/data/results.js'
export default {
  data() {
    const newPersons = persons
      .filter(
        (x, i) =>
          i ===
          persons.indexOf(
            persons.find((y) => y.name.toLowerCase() === x.name.toLowerCase() && y.paper_id.toLowerCase() === x.paper_id.toLowerCase())
          )
      )
      .map((person) => {
        return {
          name: this.formatName(person.name)
            .split(' ')
            .map((x) => this.capitalizeName(x, true))
            .join(' '),
          paper_id: person.paper_id,
          organization: person.organization
            .split(' ')
            .map((x) => this.capitalizeName(x))
            .join(' '),
          title: person.title
            .split(' ')
            .map((x) => this.capitalizeName(x))
            .join(' '),
        }
      })
    return {
      dropOpen: false,
      username: null,
      user: {
        name: 'John Smith',
        paper_id: 99999,
        organization: 'Affiliation',
        title: 'Paper Title',
      },
      canvasContext: null,
      canvasItem: null,
      miniCanvas: null,
      minierCanvas: null,
      canvasURL: null,
      persons: newPersons,
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.reloadCanvas()
    })
  },
  methods: {
    async reloadCanvas() {
      if (
        this.username !== null &&
        !this.persons.some((x) => x.name.includes(this.username))
      )
        return
      this.canvasItem = this.$refs.cert
      this.miniCanvas = this.$refs.displaycert
      this.minierCanvas = this.$refs.displaycertsmaller
      this.canvasContext = this.canvasItem.getContext('2d')
      await this.loadCert()
    },
    capitalizeName(s, titlecase) {
      return (
        s.charAt(0).toUpperCase() +
        `${titlecase ? s.slice(1).toLowerCase() : s.slice(1)}`
      )
    },
    formatName(s) {
      const m = `${s
        .replace(/\s([A-Z])\s/g, ' $1. ')
        .replace(/\s([A-Z])$/gi, ' $1.')
        .replace(/^([A-Z])\s/gi, '$1. ')
        .replace(/([a-z][a-z])\. ([A-Z])\s/gi, '$1 $2. ')
        .replace(/\.([A-Z])\./gi, '. $1.')
        .replace(/Dr\s/gi, 'Dr. ')
        .replace(/\.([A-Z])/gi, '. $1')
        .replace(/\.\./gi, '.')}`
      return m
    },
    getCanvasURL() {
      return this.canvasItem.toDataURL('image/png')
    },
    applyText(
      canvas,
      text,
      base = 300,
      weight = 900,
      minus = 320,
      font = 'Parisienne'
    ) {
      const ctx = canvas.getContext('2d')

      // Declare a base size of the font
      let fontSize = base

      do {
        // Assign the font to the context and decrement it so it can be measured again
        //        console.log(
        //          `${(fontSize -= 10)}px ${`${font}` || '"ITC Zapf Chancery", cursive'}, Arial bold`
        //        )
        ctx.font = `${weight} ${(fontSize -= 10)}px ${
          `${font}` || '"ITC Zapf Chancery Italic 400", cursive'
        }`
      } while (ctx.measureText(text).width > canvas.width - minus)
            console.log(ctx.font)
      return ctx.font
    },
    loadCert() {
      const canvas = this.canvasItem
      const ctx = this.canvasContext
      const background = new Image()
      background.src = '/betterTemplate.jpg'
      background.onload = () => {
        const icon = new Image()
        icon.src = this.$icon(512)

        icon.onload = () => {
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
          ctx.drawImage(icon, 50, 50, 150, 150)
          this.createCert()
        }
      }
    },
    addText(canvas, text, font, x, y, minus) {
      const ctx = this.canvasContext

      ctx.font = this.applyText(
        canvas,
        text.content,
        font.size,
        font.weight,
        minus,
        font.font
      )
      ctx.textBaseline = 'bottom'

      ctx.strokeStyle = text.border
      ctx.textAlign = text.align
      ctx.lineWidth = 4

      //      ctx.shadowColor = 'black'
      //      ctx.shadowBlur = 7
      ctx.strokeText(text.content, x, y)
      ctx.shadowBlur = 0
      ctx.fillStyle = text.color
      ctx.fillText(text.content, x, y)
    },
    createCert() {
      const canvas = this.canvasItem
      //      const ctx = this.canvasContext
      this.addText(
        canvas,
        {
          content: this.user.name,
          color: '#202020',
          border: 'transparent',
          align: 'center',
        },
        { size: 62, weight: 900, font: '"ITC Zapf Chancery", cursive' },
        canvas.width / 2 + 200,
        515
      )
      this.addText(
        canvas,
        {
          content: this.user.organization,
          color: '#202020',
          border: 'transparent',
          align: 'center',
        },
        { size: 62, weight: 900, font: '"ITC Zapf Chancery", cursive' },
        canvas.width / 2 - 100,
        575,
        625
      )
      this.addText(
        canvas,
        {
          content: this.user.title,
          color: '#202020',
          border: 'transparent',
          align: 'center',
        },
        { size: 62, weight: 900, font: '"ITC Zapf Chancery", cursive' },
        canvas.width / 2,
        813,
        100
      )
      this.canvasURL = this.getCanvasURL()
    },
    downloadCanvas() {
      const canvasUrl = this.canvasURL
      window.location.href = canvasUrl
    },
    toggleDrop() {
      this.dropOpen = true
    },
    toggleOff() {
      this.dropOpen = false
    },
    disableDownload() {
      return this.user.name === 'John Smith'
    },
    setName(x) {
      this.user = x
      this.username = x.name
      this.reloadCanvas()
    },
  },
  // eslint-disable-next-line vue/require-render-return
}
</script>
