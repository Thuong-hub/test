import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient('https://zgmzqexongqjfalczfhp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnbXpxZXhvbmdxamZhbGN6ZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTk3MjYsImV4cCI6MjA2MzQ3NTcyNn0.wca5mQTpcpB2dbw2iIsFybPBz3XDc6lHK-vuPeqttCo')

document.getElementById('lecturer-form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const file = document.getElementById('avatar').files[0]
  const filePath = `avatars/${Date.now()}_${file.name}`

  await supabase.storage.from('avatars').upload(filePath, file)
  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

  await supabase.from('lecturers').insert({ name, email, avatar_url: data.publicUrl })
  loadLecturers()
})

async function loadLecturers() {
  const { data } = await supabase.from('lecturers').select('*')
  const list = document.getElementById('lecturer-list')
  list.innerHTML = ''
  data.forEach(l => {
    list.innerHTML += `
      <div class="lecturer-card">
        <img src="${l.avatar_url}" width="250" />
        <div>
          <strong>${l.name}</strong> - ${l.email}
          <button onclick="deleteLecturer(${l.id})">Delete</button>
        </div>
      </div>
    `
  })
}

window.deleteLecturer = async (id) => {
  await supabase.from('lecturers').delete().eq('id', id)
  loadLecturers()
}

loadLecturers()
