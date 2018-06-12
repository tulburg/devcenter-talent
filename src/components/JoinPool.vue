<template>
	<section class="join-pool">
		<div class="box">
			<ul class="grid separator grid-2">
				<li>
					<div class="plain">
						<h1>Product Designer</h1>
						<p>Expert product thinker designing beautiful, seamless and intuitive software applications</p>
						<a href="https://devcenter-talent.typeform.com/to/PTtgyj" class="button long">Apply as a Designer</a>
					</div>
				</li>
				<li>
					<div class="plain">
						<h1>Software Developer</h1>
						<p>Experienced software engineer, coder with expertise across different technologies</p>
						<a href="https://devcenter-talent.typeform.com/to/PTtgyj" class="button long">Apply as a Developer</a>
					</div>
				</li>
			</ul>
		</div>
	</section>
</template>

<script>
	import Bus from '@/Bus'
	export default {
		name: 'JoinPool',
		mounted() {
			Bus.$emit("Header_showLogin", true);
		},
		destroyed() {
			Bus.$emit("Header_showLogin", false);
		}
	}
</script>