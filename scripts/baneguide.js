        let slide_index = 1;
        
        document.getElementById('prev').addEventListener('click', prev_slide);
        document.getElementById('next').addEventListener('click', next_slide);

        slideShow();
        

        function next_slide(){
            slide_index += 1;
            slideShow();
        }

        function prev_slide(){
            slide_index -= 1;
            slideShow();
        }

        function slideShow(){
            let slides = document.getElementsByClassName('bg_slides');
            if (slide_index > slides.length){slide_index = 1}
            if (slide_index < 1) {slide_index = slides.length}

            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";}
            slides[slide_index-1].style.display = 'flex';
            console.log(slide_index)
        }

        /* Navigasjonstabell */
        document.querySelectorAll('baneguide_nav').forEach(item => {
        item.addEventListener('click', bg_nav)
        })

        /* Funnet online */
        let table = document.getElementById("baneguide_navbar");
        if (table != null) {
            for (let i = 0; i < table.rows.length; i++) {
                for (let j = 0; j < table.rows[i].cells.length; j++){
                    table.rows[i].cells[j].onclick = function() {bg_nav(this);};
                }
            }
        }

        function bg_nav(cel){
            let click_value = (cel.innerHTML);
            slide_index = click_value;
            slideShow();
        }