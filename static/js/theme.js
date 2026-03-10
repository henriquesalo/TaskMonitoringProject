(function(){
    // Função auxiliar para atualizar o ícone do botão
    function updateIcon() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        var theme = document.documentElement.getAttribute('data-theme');
        // Sol para tema claro, lua para tema escuro
        btn.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcon();
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'light' ? 'dark' : 'light');
    }

    // Inicializar ao carregar a página
    document.addEventListener('DOMContentLoaded', function(){
        // Anexar manipulador de eventos ao botão
        var btn = document.getElementById('theme-toggle');
        if (btn) btn.addEventListener('click', toggleTheme);
        updateIcon();
    });

    // Expor para uso global se necessário
    window.setTheme = setTheme;
    window.toggleTheme = toggleTheme;
})();