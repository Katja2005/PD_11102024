window.onload = function() {
    // Show the register form
    document.getElementById('register-button').onclick = function() {
        document.querySelector('.login').classList.add('hidden');
        document.querySelector('.register').classList.remove('hidden');
        document.querySelector('.registered').classList.add('hidden');
    };

    // Show the login form
    document.getElementById('login-button').onclick = function() {
        document.querySelector('.register').classList.add('hidden');
        document.querySelector('.login').classList.remove('hidden');
        document.querySelector('.registered').classList.add('hidden');
    };

    // Registration form submission
    const registerForm = document.getElementById('register-submit');
    registerForm.onclick = async function() {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const passwordConfirmation = document.getElementById('reg-password_confirmation').value;
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Pievienojiet šo galveni
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation
                })
            });
    
            const data = await response.json();
            if (response.ok) {
                alert('Registration successful!');
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                document.querySelector('.register').classList.add('hidden');
                document.querySelector('.login').classList.remove('hidden');
            } else {
                alert('Registration failed: ' + data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    

    // Login form submission
    const loginForm = document.getElementById('login-submit');
    loginForm.onclick = async function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Login successful!');
                // Save token in localStorage
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                document.querySelector('.login').classList.add('hidden');
                document.querySelector('.registered').classList.remove('hidden');
                await fetchAllPosts(data.token); // Fetch posts after login
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getForm = document.getElementById('get-user-form');
    getForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        let formData = new FormData(event.target);
        let token = formData.get('token') || localStorage.getItem('token'); // Use localStorage token if not provided

        try {
            const response = await fetch('http://127.0.0.1:8000/api/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('user-data').innerHTML = `<p>User Email: ${data.email}<br>
                                                                    User Name: ${data.name}</p>`;
                await fetchAllPosts(token);
            }
        } catch (error) {
            console.log(error);
        }
    });

    const postForm = document.getElementById('create-post-form');
    postForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        let formData = new FormData(event.target);
        let token = formData.get('token') || localStorage.getItem('token'); // Use localStorage token if not provided

        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.get('title'),
                    body: formData.get('body')
                })
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('post-data').innerHTML = `<p>Post Created Successfully!</p>
                                                                  <p><strong>Title:</strong> ${data.title}, <strong>Body:</strong> ${data.body}</p>`;
                await fetchAllPosts(token);
                document.getElementById('title').value = '';
                document.getElementById('body').value = '';
            }
        } catch (error) {
            console.log(error);
        }
    });

    async function fetchAllPosts(token) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const posts = await response.json();

            if (response.ok) {
                const postsContainer = document.getElementById('user-posts');
                postsContainer.innerHTML = '';
                posts.forEach(post => {
                    postsContainer.innerHTML += `
                        <div class="post">
                            <p>Title: ${post.title}</p>
                            <p>Body: ${post.body}</p>
                        </div>
                    `;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Check if token is available in localStorage and fetch posts if it exists
    const token = localStorage.getItem('token');
    if (token) {
        fetchAllPosts(token);
    }
};
