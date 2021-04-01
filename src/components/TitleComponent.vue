<template>
	<q-page-sticky expand position="top">
		<q-toolbar class="bg-red text-white">
			<Avatar />
			<q-toolbar-title>
			{{ text }}
			</q-toolbar-title>
		</q-toolbar>
	</q-page-sticky>
</template>

<script>
import Avatar from 'src/components/AvatarComponent.vue'
export default {
	name: 'TittleComponent',
	components : {Avatar},
	props: {
		text: {
			type: String,
			required: true
		},
	}
}
</script>
