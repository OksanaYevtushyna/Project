 const url = 'Wiki.pdf'; /*WRITE THE PATH TO THE LOCAL FOLFER*/
            
            let pdfDoc = null,
                pageNum = 1,
                pageIsRendering = false,
                pageNumIsPending = null,
                scale = 1.5;
            
            const canvas = document.querySelector('#pdf-render'),
                  ctx = canvas.getContext('2d');
            
            //Render the page
            const renderPage = num => {
                pageIsRendering = true;
                console.log(num);
                
                pdfDoc.getPage(num).then(page => {
                    const viewport = page.getViewport({ scale });
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    
                    const renderCtx = {
                        canvasContext: ctx,
                        viewport
                    }
                    
                    page.render(renderCtx).promise.then(() => {
                        pageIsRendering = false;
                        
                        if(pageNumIsPending != null) {
                            renderPage(pageNumIsPending);
                            pageNumIsPending = null;
                        }
                    });
                    
                    document.querySelector('#page-num').textContent = num;
                });
            };
            
            const checkRenderPage = num => {
                if(pageIsRendering) {
                    pageNumIsPending = num;
                } else {
                    renderPage(num);
                }
            }
            
            const showPrevPage = () => {
                if(pageNum <= 1) {
                    return;
                } 
                pageNum--;
                checkRenderPage(pageNum);
            }
            
            const showNextPage = () => {
                if(pageNum >= pdfDoc.numPages) {
                    return;
                } 
                pageNum++;
                checkRenderPage(pageNum);
            }
        
        
        var changePages = function(e) {
            if(e.which === 33){
                if(pageNum <= 1) {
                    return;
                } 
                pageNum--;
                checkRenderPage(pageNum);
            } else if(e.which === 34){
                if(pageNum >= pdfDoc.numPages) {
                    return;
                } 
                pageNum++;
                checkRenderPage(pageNum);
            } else if(e.which === 88 && e.shiftKey){
                if(pageNum <= 1) {
                    console.log('Hi')
                    return;
                }
                pageNum = pageNum - (pageNum - 1);
                checkRenderPage(pageNum);
            } else if(e.which === 67 && e.shiftKey) {
                if(pageNum >= pdfDoc.numPages) {
                    return;
                }
                pageNum = pdfDoc.numPages;
                checkRenderPage(pageNum);
            }
        }   
        
        document.onkeydown = changePages;
            

            
           const zoomIn = () => {
                scale = scale + 0.15;
                checkRenderPage(pageNum);
            }
            
            const zoomOut = () => {
                if(scale <= 0.15) {
                    return;
                }
                scale = scale - 0.15;
                checkRenderPage(pageNum);
            }
            
            
            document.addEventListener("keydown", function(event) {
              console.log(event.which);
                if (event.keyCode == 109){
                    if(scale <= 0.15) {
                        return;
                    }
                    scale = scale - 0.15;
                    debugger
                    checkRenderPage(pageNum);
                } else if (event.keyCode == 107) {
                    scale = scale + 0.15;
                    checkRenderPage(pageNum);
                }
            })
             
            //Get Document
            pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
                pdfDoc = pdfDoc_;
                
                document.querySelector('#page-count').textContent = pdfDoc.numPages;
                
                renderPage(pageNum)
            })
        
            
            
            document.querySelector('#prev-page').addEventListener('click', showPrevPage);
            document.querySelector('#next-page').addEventListener('click', showNextPage);
            document.querySelector('#zoom_in').addEventListener('click', zoomIn);
            document.querySelector('#zoom_out').addEventListener('click', zoomOut);/*WRITE THE PATH TO THE LOCAL FOLFER*/
            
            