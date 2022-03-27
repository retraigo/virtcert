<template>
  <div class="p-4">
    <div class="py-4 flex flex-col items-center space-y-4">
      Enter your name
      <input
        v-model="username"
        type="text"
        class="w-48 h-12 bg-gray-900 border border-gray-300"
      />
      <button
        class="p-2 bg-blue-500"
        @click="reloadCanvas"
      >Generate</button>
      <canvas
        ref="cert"
        height="720px"
        width="1280px"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: null,
      canvasContext: null,
      canvasItem: null,
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.reloadCanvas()
    })
  },
  methods: {
    async reloadCanvas() {
      this.canvasItem = this.$refs.cert
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
      background.src = '/cert_base.png'
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
      const ctx = this.canvasContext
      this.addText(
        canvas,
        {
          content: 'Easwari Engineering College',
          color: 'rgb(96, 165, 250)',
          border: 'transparent',
          align: 'left',
        },
        { size: 48, weight: 700 },
        225,
        120
      )
      this.addText(
        canvas,
        {
          content: 'Department of Artificial Intelligence & Data Science',
          color: '#000000',
          border: 'transparent',
          align: 'left',
        },
        { size: 50, weight: 800 },
        225,
        160
      )
      this.addText(
        canvas,
        {
          content: 'International Virtual Conference on',
          color: 'rgb(96, 165, 250)',
          border: 'transparent',
          align: 'center',
        },
        { size: 50, weight: 800 },
        canvas.width / 2,
        230
      )
      this.addText(
        canvas,
        {
          content: 'Machine Learning Applications in',
          color: 'rgb(96, 165, 250)',
          border: 'transparent',
          align: 'center',
        },
        { size: 50, weight: 800 },
        canvas.width / 2,
        270
      )
      this.addText(
        canvas,
        {
          content: 'Applied Sciences and Mathematics',
          color: 'rgb(96, 165, 250)',
          border: 'transparent',
          align: 'center',
        },
        { size: 50, weight: 800 },
        canvas.width / 2,
        310
      )
      this.addText(
        canvas,
        {
          content: 'Certificate of Participation',
          color: '#000000',
          border: 'transparent',
          align: 'center',
        },
        { size: 96, weight: 700, font: 'cursive' },
        canvas.width / 2,
        450
      )

      this.addText(
        canvas,
        {
          content: this.username,
          color: '#202020',
          border: 'transparent',
          align: 'center',
        },
        { size: 84, weight: 900, font: 'cursive' },
        canvas.width / 2,
        540
      )
      ctx.strokeStyle = "#000000"
      ctx.setLineDash([10, 15, 10, 10]);
      ctx.lineWidth = 4
      ctx.moveTo(100, 560)
      ctx.lineTo(1180, 560)
      ctx.stroke()
    },
  },
  // eslint-disable-next-line vue/require-render-return
}
</script>
