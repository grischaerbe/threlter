<div class="relative w-full top-0 left-0 flex flex-row items-start">
	<div class="flex-1 flex flex-row justify-start">
		<slot name="left" />
	</div>

	<div class="flex-1 flex flex-row justify-center">
		<slot name="center" />
	</div>

	<div class="flex-1 flex flex-row justify-end">
		<slot name="right" />
	</div>
</div>
