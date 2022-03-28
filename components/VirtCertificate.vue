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
          <div :class="`${dropOpen ? 'block' : 'hidden'} absolute z-40 flex flex-col w-full md:w-72 bg-gray-700 p-2`">
            <div
              v-for="person in persons.filter(x => x.name.toLowerCase().includes(username ? username.toLowerCase() : ''))"
              :key="person.name"
              class="p-2 cursor-pointer transition duration-500 ease-in-out bg-gray-700 hover:bg-blue-700"
              @click="x => {setName(person);toggleOff()}"
            >
              <span>{{person.name}}</span>
            </div>
          </div>
        </div>
        <button
          class="px-4 h-8 py-1 bg-blue-500 text-white rounded-2xl transition duration-500 ease-in-out transform hover:translate-y-1"
          @click="reloadCanvas"
        >Generate</button>
      </div>
      <button
        class="px-4 h-8 py-1 bg-blue-500 text-white rounded-2xl transition duration-500 ease-in-out transform hover:scale-110"
        :disabled="disableDownload()"
        @click="downloadCanvas"
      >Download</button>
      <canvas
        ref="cert"
        class="hidden"
        height="1131px"
        width="1600px"
      />
      <canvas
        ref="displaycert" class = "hidden md:block"
        height="424px"
        width="600px"
      />
      <canvas
        ref="displaycertsmaller"  class = "block md:hidden"
        height="226px"
        width="320px"
      />
    </div>
  </div>
</template>
<script>
import persons from '@/data/results.js'
export default {
  data() {
    return {
      dropOpen: false,
      username: null,
      user: {
        name: 'John Smith',
        organization: 'Lorem Ipsum',
        title: 'Paper Title',
      },
      canvasContext: null,
      canvasItem: null,
      miniCanvas: null,
      minierCanvas: null,
      persons,
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
    applyText(canvas, text, base = 300, weight = 900, font = 'Merriweather') {
      const ctx = canvas.getContext('2d')

      // Declare a base size of the font
      let fontSize = base

      do {
        console.log('doing')
        console.log(ctx.font)
        // Assign the font to the context and decrement it so it can be measured again
        console.log(
          `${(fontSize -= 10)}px ${`${font}` || 'cursive'}, Arial bold`
        )
        ctx.font = `${weight} ${(fontSize -= 10)}px ${
          `${font}` || 'cursive'
        }, Arial bold`
        console.log(ctx.font)
      } while (ctx.measureText(text).width > canvas.width - 320)
      console.log(ctx.font)
      return ctx.font
    },
    loadCert() {
      const canvas = this.canvasItem
      const ctx = this.canvasContext
      const background = new Image()
      background.src = '/template.jpeg'
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
    addText(canvas, text, font, x, y) {
      const ctx = this.canvasContext

      ctx.font = this.applyText(
        canvas,
        text.content,
        font.size,
        font.weight,
        font.font
      )

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
        { size: 72, weight: 900, font: 'cursive' },
        canvas.width / 2 + 200,
        500
      )
      this.addText(
        canvas,
        {
          content: this.user.organization,
          color: '#202020',
          border: 'transparent',
          align: 'center',
        },
        { size: 72, weight: 900, font: 'cursive' },
        canvas.width / 2 - 100,
        560
      )
      this.addText(
        canvas,
        {
          content: this.user.title,
          color: '#202020',
          border: 'transparent',
          align: 'center',
        },
        { size: 72, weight: 900, font: 'cursive' },
        canvas.width / 2,
        795
      )
      const oldCanvas = canvas.toDataURL('image/png')
      const img = new Image()
      console.log(oldCanvas)
      img.src = oldCanvas
      img.onload = () => {
        const newCtx = this.miniCanvas.getContext('2d')
        newCtx.drawImage(
          img,
          0,
          0,
          this.miniCanvas.width,
          this.miniCanvas.height
        )
        const newCtx2 = this.minierCanvas.getContext('2d')
        newCtx2.drawImage(
          img,
          0,
          0,
          this.minierCanvas.width,
          this.minierCanvas.height
        )
      }
    },
    downloadCanvas() {
      const canvasUrl = this.canvasItem.toDataURL('image/png')
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
