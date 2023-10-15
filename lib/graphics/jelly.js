// eslint-disable-next-line import/no-extraneous-dependencies
import * as THREE from 'three'

class Jelly {
	constructor(scope) {
		this.scope = scope

		this.request = null
		this.noiseScale = 1
		this.noiseStrength = 0.2
		this.maxRadius = 0.8
		this.bulgeStrength = -0.06
		this.mouse = new THREE.Vector2()
		this.time = 0
		this.interactionFlag = false
		this.playing = true

		this.init()
	}

	isInView() {
		const { top, bottom } = this.scopeEl.getBoundingClientRect()
		return top <= window.innerHeight && bottom >= 0
	}

	cancel() {
		if (!this.request) return
		cancelAnimationFrame(this.request)
		this.request = null
	}

	pause() {
		this.cancel()
		this.playing = false
	}

	resume() {
		this.playing = true
		if (!this.request) this.animate()
	}

	clear() {
		if (!this.renderer) return

		this.scene.traverse(object => {
			if (!object.isMesh) return
			object.geometry.dispose()
			object.material.dispose()
		})

		this.renderer.dispose()
		this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)

		this.camera = null
		this.mesh = null
		this.renderer = null
		this.scene = null

		this.removeEvents()
	}

	restart() {
		if (this.renderer) return
		this.start()
	}

	resized() {
		if (!this.isInView()) return
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}

	scroll() {
		if (this.isInView()) {
			this.restart()
			this.resume()
		} else {
			this.pause()
			this.clear()
		}
	}

	onMouseMove(event) {
		this.interactionFlag = true
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
	}

	onMouseLeave() {
		this.interactionFlag = false
	}

	onTouchMove(event) {
		this.interactionFlag = true
		const touch = event.touches[0]
		this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1
		this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1
	}

	onTouchEnd() {
		this.interactionFlag = false
	}

	removeEvents() {
		// Mouse event handlers
		this.pointerProxyEl.removeEventListener('mousemove', this.onMouseMove.bind(this))
		this.pointerProxyEl.removeEventListener('mouseleave', this.onMouseLeave.bind(this))

		// Touch event handlers
		this.pointerProxyEl.removeEventListener('touchmove', this.onTouchMove.bind(this))
		this.pointerProxyEl.removeEventListener('touchend', this.onTouchEnd.bind(this))

		// Resize event handler
		window.removeEventListener('resize', this.resized.bind(this))
		window.removeEventListener('resize', this.scroll.bind(this))
	}

	setUpEvents() {
		// Mouse event handlers
		this.pointerProxyEl.addEventListener('mousemove', this.onMouseMove.bind(this))
		this.pointerProxyEl.addEventListener('mouseleave', this.onMouseLeave.bind(this))

		// Touch event handlers
		this.pointerProxyEl.addEventListener('touchmove', this.onTouchMove.bind(this))
		this.pointerProxyEl.addEventListener('touchend', this.onTouchEnd.bind(this))

		// Resize event handler
		window.addEventListener('resize', this.resized.bind(this))
		window.addEventListener('resize', this.scroll.bind(this))
	}

	setUpScroll() {
		// Scroll event handler
		window.addEventListener('scroll', this.scroll.bind(this))
	}

	animate() {
		this.request = null
		this.time += 0.01

		const { position } = this.mesh.geometry.attributes
		const { array } = position

		for (let i = 0; i < array.length; i += 3) {
			const x = array[i]
			const y = array[i + 1]

			if (this.interactionFlag) {
				const dx = this.mouse.x - x
				const dy = this.mouse.y - y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < this.maxRadius) {
					const factor = 1 - (distance / this.maxRadius) ** 2
					array[i + 2] += factor * this.bulgeStrength
				}
			} else {
				// array[i + 2] *= 0.9;  // Blend towards zero when there's no interaction
			}

			const noiseValue = this.noiseStrength * (
				Math.sin(this.time + x * this.noiseScale) + Math.cos(this.time + y * this.noiseScale)
			)

			array[i + 2] = array[i + 2] * 0.95 + noiseValue * 0.05
		}

		position.needsUpdate = true

		if (this.playing) this.request = requestAnimationFrame(() => this.animate())
		this.renderer.render(this.scene, this.camera)
	}

	start() {
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.renderer = new THREE.WebGLRenderer()
		this.containerEl = this.scopeEl.querySelector('[data-jelly=container]')
		this.pointerProxyEl = this.scopeEl.querySelector('[data-jelly=pointer]') || this.renderer.domElement

		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.setUpEvents()
		this.containerEl.appendChild(this.renderer.domElement)

		const geometry = new THREE.PlaneGeometry(5, 5, 20, 20)
		const texture = new THREE.TextureLoader().load(this.imgSrc) // Replace with your image path

		texture.colorSpace = THREE.SRGBColorSpace

		const material = new THREE.MeshBasicMaterial({
			map: texture,
		})

		this.mesh = new THREE.Mesh(geometry, material)
		this.scene.add(this.mesh)
		this.camera.position.z = 5
	}

	init() {
		this.scopeEl = document.querySelector(this.scope)

		if (!this.imgSrc) {
			const imgEl = this.scopeEl.querySelector('[data-jelly=img]')
			this.imgSrc = imgEl.getAttribute('src')
			imgEl.parentNode.removeChild(imgEl)
		}

		this.setUpScroll()
		this.scroll()
	}
}

export default (...scopes) => scopes.flat(Infinity).map(scope => new Jelly(scope))
