// Checks if the user is logged in through service, if not hides the listed fields
if (('{#product}' !== 'Service' || '{#is_authenticated}' === 'false')) {
	// Loop through all radio and checkbox elements
	Array.from(document.querySelectorAll('.radio,.checkbox')).forEach(selectElement => {
		// Loop through each span object within radio (these hold the input and label)
		Array.from(selectElement.children).forEach(spanElement => {
			let hiddenFlag = false;
			
			// Loop through input and label and find inputs with _ at the start of the value
			Array.from(spanElement.children).forEach(listElement => {
				if (listElement.nodeName === 'INPUT' && listElement.value[0] === '_') {
					hiddenFlag = true;
				}				
			});
			
			// If the input element was private then hide the span element
			if (hiddenFlag) {
				spanElement.classList.add('hidden');
			}
		});
	});
}