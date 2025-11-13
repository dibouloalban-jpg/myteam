import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Briefcase, Star, Check, X, Search, Filter, Bell, Settings, LogOut, Plus, Eye, DollarSign, Clock, Award, Shield } from 'lucide-react';

// Configuration Supabase
const supabaseUrl = 'https://uynyxiinnkwxlepvqozb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bnl4aWlubmt3eGxlcHZxb3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Nzk4MTksImV4cCI6MjA3ODQ1NTgxOX0.PnCC-9942U7H--fMwdpS5UJR-X-a7Fq3C6H7_P0k8qU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration PayPal
const PAYPAL_CLIENT_ID = 'AWpt-e-MhJcM1JbDX9saMQQbOgZDNLe8-9TNYdSapSAggSpUUvC9IYorea4r9vr79-ItG_5VpgL8BRZn';

// Configuration Resend
const RESEND_API_KEY = 're_UnwurEdp_JjjGiEqBrGhxLjxGP4hsfCNk';

function MyTeamApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // États pour les formulaires
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [createTeamForm, setCreateTeamForm] = useState({
    title: '',
    description: '',
    category: '',
    totalSlots: 3,
    budget: '',
    deadline: '',
    tasks: [{ title: '', description: '', price: '' }]
  });

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    checkUser();
  }, []);

  // Charger les données selon la page
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadTeams();
      loadNotifications();
      if (currentPage === 'my-teams') {
        loadMyTeams();
      }
    }
  }, [user, currentPage]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
    }
  };

  const loadUserProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setUserProfile(data);
    }
  };

  const loadTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        profiles:owner_id (name, avatar_url, rating),
        team_members (count)
      `)
      .eq('status', 'recruiting')
      .order('created_at', { ascending: false });
    
    if (data) {
      setTeams(data);
    }
  };

  const loadMyTeams = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members (
          *,
          profiles (name, avatar_url, rating)
        )
      `)
      .or(`owner_id.eq.${user.id},team_members.user_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
    
    if (data) {
      setMyTeams(data);
    }
  };

  const loadNotifications = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) {
      setNotifications(data);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (authMode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password
      });
      
      if (error) {
        alert('Erreur de connexion: ' + error.message);
      } else {
        setUser(data.user);
        setShowAuthModal(false);
        setAuthForm({ email: '', password: '', name: '' });
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password
      });
      
      if (error) {
        alert('Erreur d\'inscription: ' + error.message);
      } else {
        // Créer le profil
        await supabase.from('profiles').insert({
          user_id: data.user.id,
          name: authForm.name,
          email: authForm.email,
          role: 'executor',
          rating: 0,
          completed_tasks: 0
        });
        
        setUser(data.user);
        setShowAuthModal(false);
        setAuthForm({ email: '', password: '', name: '' });
        
        // Envoyer email de bienvenue via Resend
        sendWelcomeEmail(authForm.email, authForm.name);
      }
    }
  };

  const sendWelcomeEmail = async (email, name) => {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'MyTeam <onboarding@myteam.com>',
          to: email,
          subject: 'Bienvenue sur MyTeam.com',
          html: `<h1>Bienvenue ${name}!</h1><p>Merci de rejoindre MyTeam.com. Commencez à explorer les équipes disponibles!</p>`
        })
      });
    } catch (error) {
      console.error('Erreur envoi email:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setCurrentPage('home');
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    const { data, error } = await supabase
      .from('teams')
      .insert({
        owner_id: user.id,
        title: createTeamForm.title,
        description: createTeamForm.description,
        category: createTeamForm.category,
        total_slots: createTeamForm.totalSlots,
        filled_slots: 0,
        budget: parseFloat(createTeamForm.budget),
        deadline: createTeamForm.deadline,
        status: 'recruiting',
        tasks: createTeamForm.tasks
      })
      .select()
      .single();
    
    if (data) {
      alert('Équipe créée avec succès!');
      setCreateTeamForm({
        title: '',
        description: '',
        category: '',
        totalSlots: 3,
        budget: '',
        deadline: '',
        tasks: [{ title: '', description: '', price: '' }]
      });
      setCurrentPage('my-teams');
      loadMyTeams();
    } else {
      alert('Erreur lors de la création: ' + error.message);
    }
  };

  const handleApplyToTeam = async (teamId) => {
    if (!user || !userProfile) return;
    
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: user.id,
        status: 'pending'
      });
    
    if (data) {
      alert('Candidature envoyée avec succès!');
      loadTeams();
    } else {
      alert('Erreur: ' + error.message);
    }
  };

  const addTask = () => {
    setCreateTeamForm({
      ...createTeamForm,
      tasks: [...createTeamForm.tasks, { title: '', description: '', price: '' }]
    });
  };

  const updateTask = (index, field, value) => {
    const newTasks = [...createTeamForm.tasks];
    newTasks[index][field] = value;
    setCreateTeamForm({ ...createTeamForm, tasks: newTasks });
  };

  const removeTask = (index) => {
    const newTasks = createTeamForm.tasks.filter((_, i) => i !== index);
    setCreateTeamForm({ ...createTeamForm, tasks: newTasks });
  };

  // Page d'accueil
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-900 mb-6">
            Construisez Votre Équipe de Rêve
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            MyTeam.com connecte les entrepreneurs avec des talents qualifiés. 
            Créez votre équipe, définissez vos tâches, et obtenez des résultats exceptionnels.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Commencer Gratuitement
            </button>
            <button
              onClick={() => setCurrentPage('browse')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Explorer les Équipes
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Équipes Permanentes</h3>
            <p className="text-gray-600">
              Construisez une équipe stable et travaillez ensemble sur le long terme, 
              contrairement aux plateformes traditionnelles.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Shield className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Paiements Sécurisés</h3>
            <p className="text-gray-600">
              Système d'escrow pour protéger vos paiements. L'argent n'est libéré 
              qu'après validation des livrables.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Award className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Talents Vérifiés</h3>
            <p className="text-gray-600">
              Tous les exécuteurs passent un test de compétences avant de pouvoir 
              rejoindre des équipes.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-600 text-white rounded-xl p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,500+</div>
              <div className="text-blue-100">Exécuteurs Actifs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">300+</div>
              <div className="text-blue-100">Équipes Créées</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Tâches Complétées</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Client</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Page de navigation des équipes
  const BrowseTeamsPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Équipes Disponibles</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              Filtres
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{team.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {team.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{team.filled_slots}/{team.total_slots}</div>
                    <div className="text-sm text-gray-500">Places</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{team.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="font-semibold">{team.budget}€</span>
                    <span>Budget Total</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-orange-600" />
                    <span>Deadline: {new Date(team.deadline).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{team.profiles?.name || 'Business Owner'}</div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{team.profiles?.rating || 0}/5</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => user ? handleApplyToTeam(team.id) : setShowAuthModal(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Postuler
                </button>
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-16">
            <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune équipe disponible</h3>
            <p className="text-gray-500">Revenez bientôt pour découvrir de nouvelles opportunités!</p>
          </div>
        )}
      </div>
    </div>
  );

  // Page de création d'équipe
  const CreateTeamPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Créer une Nouvelle Équipe</h1>

        <form onSubmit={handleCreateTeam} className="bg-white rounded-xl shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Titre du Projet *
            </label>
            <input
              type="text"
              required
              value={createTeamForm.title}
              onChange={(e) => setCreateTeamForm({ ...createTeamForm, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Création de contenu YouTube"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={createTeamForm.description}
              onChange={(e) => setCreateTeamForm({ ...createTeamForm, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez votre projet en détail..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                required
                value={createTeamForm.category}
                onChange={(e) => setCreateTeamForm({ ...createTeamForm, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner...</option>
                <option value="video">Montage Vidéo</option>
                <option value="design">Design Graphique</option>
                <option value="writing">Rédaction</option>
                <option value="development">Développement</option>
                <option value="marketing">Marketing</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre de Membres *
              </label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={createTeamForm.totalSlots}
                onChange={(e) => setCreateTeamForm({ ...createTeamForm, totalSlots: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget Total (€) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={createTeamForm.budget}
                onChange={(e) => setCreateTeamForm({ ...createTeamForm, budget: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date Limite *
              </label>
              <input
                type="date"
                required
                value={createTeamForm.deadline}
                onChange={(e) => setCreateTeamForm({ ...createTeamForm, deadline: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Tâches *
              </label>
              <button
                type="button"
                onClick={addTask}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                <Plus size={16} />
                Ajouter une tâche
              </button>
            </div>

            <div className="space-y-4">
              {createTeamForm.tasks.map((task, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900">Tâche {index + 1}</h4>
                    {createTeamForm.tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      value={task.title}
                      onChange={(e) => updateTask(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Titre de la tâche"
                    />
                    <textarea
                      required
                      rows={2}
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description de la tâche"
                    />
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={task.price}
                      onChange={(e) => updateTask(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Prix (€)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Créer l'Équipe
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('dashboard')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Page Mes Équipes
  const MyTeamsPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Équipes</h1>
          <button
            onClick={() => setCurrentPage('create-team')}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Nouvelle Équipe
          </button>
        </div>

        <div className="grid gap-6">
          {myTeams.map((team) => (
            <div key={team.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{team.title}</h3>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {team.category}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      team.status === 'recruiting' ? 'bg-green-100 text-green-700' :
                      team.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {team.status === 'recruiting' ? 'Recrutement' :
                       team.status === 'in_progress' ? 'En cours' : 'Terminé'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{team.filled_slots}/{team.total_slots}</div>
                  <div className="text-sm text-gray-500">Membres</div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{team.description}</p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign size={24} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Budget</div>
                    <div className="font-bold text-gray-900">{team.budget}€</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Deadline</div>
                    <div className="font-bold text-gray-900">
                      {new Date(team.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Award size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tâches</div>
                    <div className="font-bold text-gray-900">{team.tasks?.length || 0}</div>
                  </div>
                </div>
              </div>

              {team.team_members && team.team_members.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Membres de l'équipe</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {team.team_members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                        <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {member.profiles?.name || 'Membre'}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star size={12} className="text-yellow-500 fill-current" />
                            <span className="text-gray-600">{member.profiles?.rating || 0}/5</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          member.status === 'approved' ? 'bg-green-100 text-green-700' :
                          member.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {member.status === 'approved' ? 'Approuvé' :
                           member.status === 'pending' ? 'En attente' : 'Refusé'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {myTeams.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune équipe</h3>
            <p className="text-gray-500 mb-6">Commencez par créer votre première équipe!</p>
            <button
              onClick={() => setCurrentPage('create-team')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Créer une Équipe
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Modal d'authentification
  const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {authMode === 'login' ? 'Connexion' : 'Inscription'}
          </h2>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jean Dupont"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {authMode === 'login' ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {authMode === 'login' 
              ? 'Pas encore de compte ? S\'inscrire' 
              : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );

  // Header
  const Header = () => (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              MT
            </div>
            <span className="text-xl font-bold text-gray-900">MyTeam.com</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentPage('browse')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Explorer
            </button>
            {user && (
              <>
                <button
                  onClick={() => setCurrentPage('my-teams')}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Mes Équipes
                </button>
                <button
                  onClick={() => setCurrentPage('create-team')}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Créer
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Bell size={24} />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div className="hidden md:block">
                    <div className="font-semibold text-gray-900">
                      {userProfile?.name || 'Utilisateur'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {userProfile?.role === 'owner' ? 'Business Owner' : 'Exécuteur'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <LogOut size={24} />
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'browse' && <BrowseTeamsPage />}
      {currentPage === 'create-team' && user && <CreateTeamPage />}
      {currentPage === 'my-teams' && user && <MyTeamsPage />}
      
      {showAuthModal && <AuthModal />}
    </div>
  );
}

export default MyTeamApp;