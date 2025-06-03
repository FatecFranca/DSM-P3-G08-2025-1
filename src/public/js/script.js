$(document).ready(function () {
    // Verificar se há uma preferência de tema armazenada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        $('html').attr('data-theme', 'dark');
        $('.dark-mode-toggle img').attr('src', '/src/images/light_mode.svg');
    }

    // Alternar entre modo claro e escuro
    $('.dark-mode-toggle').click(function () {
        const html = $('html');
        const currentTheme = html.attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Atualizar ícone
        const img = $(this).find('img');
        img.attr('src', newTheme === 'dark' ?
            '/src/images/light_mode.svg' :
            '/src/images/dark_mode.svg');

        // Atualizar ícone do olho quando o tema mudar
        const passwordInput = $('.toggle-password').siblings('input');
        const isVisible = passwordInput.attr('type') === 'text';
        $('.toggle-password .material-symbols-outlined').text(isVisible ? 'visibility_off' : 'visibility');
    });

    // Aplicar filtros
    $('.filter-group button').click(function () {
        const filters = {
            game: $('#game').val(),
            skill: $('#skill').val(),
            time: $('#time').val(),
            region: $('#region').val()
        };
        // Aplicar filtros
    });

    // Menu mobile
    $('.mobile-menu-button').click(function () {
        $('nav ul').toggleClass('active');
    });

    // Modal de criação de post
    const $modalOverlay = $('#createPostModal');
    const $createPostButton = $('.create-post');
    const $closeModal = $('#closeModal');
    const $cancelButton = $('#cancelButton');
    const $imageUpload = $('#imageUpload');
    const $imagePreview = $('#imagePreview');
    const $tagsInput = $('.tags-input');
    const $tagsContainer = $('.tags-input-container');
    const $submitButton = $('#submitButton');
    const $createPostForm = $('#createPostForm');

    // Abrir modal
    $createPostButton.click(function () {
        $modalOverlay.css('display', 'flex');
    });

    // Fechar modal
    $closeModal.add($cancelButton).click(function () {
        $modalOverlay.hide();
    });

    // Clicar fora para fechar
    $modalOverlay.click(function (e) {
        if (e.target === this) {
            $(this).hide();
        }
    });

    // Preview da imagem
    $imageUpload.change(function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $imagePreview.attr('src', e.target.result).show();
            }
            reader.readAsDataURL(file);
        }
    });

    // Gerenciamento de tags
    $tagsInput.keydown(function (e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();

            const tagValue = $(this).val().trim();
            if (tagValue) {
                const $tag = $('<span>')
                    .addClass('tag')
                    .html(`${tagValue} <span class="tag-close">×</span>`);

                $tagsContainer.prepend($tag);
                $(this).val('');

                // Adicionar evento para remover a tag
                $tag.find('.tag-close').click(function () {
                    $(this).parent().remove();
                });
            }
        }
    });

    // Remover tags existentes
    $('.tag-close').click(function () {
        $(this).parent().remove();
    });

    // Enviar formulário
    $submitButton.click(function () {
        if ($createPostForm[0].checkValidity()) {
            alert('Anúncio criado com sucesso!');
            $modalOverlay.hide();
        } else {
            // Disparar validações nativas do formulário
            $createPostForm.trigger('submit');
        }
    });

    // Handle user profile click
    document.addEventListener('DOMContentLoaded', function () {
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            // Create a div that wraps the profile image and name
            const profileContent = document.createElement('div');
            profileContent.className = 'profile-content';
            profileContent.style.display = 'flex';
            profileContent.style.alignItems = 'center';
            profileContent.style.gap = '0.5rem';
            profileContent.style.cursor = 'pointer';

            // Move the profile image and name into the new div
            const profileImg = userProfile.querySelector('img');
            const profileName = userProfile.querySelector('span');
            const themeToggle = userProfile.querySelector('.theme-toggle');

            if (profileImg && profileName) {
                profileContent.appendChild(profileImg);
                profileContent.appendChild(profileName);
                userProfile.insertBefore(profileContent, themeToggle);

                // Add click event only to the profile content
                profileContent.addEventListener('click', function () {
                    window.location.href = 'src/pages/login.html';
                });
            }
        }
    });

    // Toggle password visibility
    $('.toggle-password').click(function () {
        const passwordInput = $(this).siblings('input');
        const icon = $(this).find('.material-symbols-outlined');
        const isVisible = passwordInput.attr('type') === 'text';

        passwordInput.attr('type', isVisible ? 'password' : 'text');
        icon.text(isVisible ? 'visibility' : 'visibility_off');
    });
});