function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'bg-dark text-white';
    
    footer.innerHTML = `
        <div class="container px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5">
                <div class="col-md-10 col-lg-10 col-xl-10">
                    <div class="t2"><span style="color: var(--bs-warning)">Black Schools</span> Reconstructing an American History</div>
                    <div class="h5">African American Cultural Heritage Action Fund</div>
                    <div class="h5">In collaboration with MIT Department of Urban Studies and Planning</div>
                    <div class="small text-muted fst-italic">Copyright &copy; Your Website 2023</div>
                </div>
            </div>
        </div>
    `;

    // Find the body element and append the footer
    document.body.appendChild(footer);
}

// Call the function when the document is loaded
document.addEventListener('DOMContentLoaded', createFooter); 