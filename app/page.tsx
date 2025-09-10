"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [users, setUsers] = useState([])
  const [adventures, setAdventures] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [error, setError] = useState(null)

  // User form state
  const [userForm, setUserForm] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    level: 1,
    starScore: 0,
    gems: 0,
    penaltyBar: 0,
  })

  // Adventure form state
  const [adventureForm, setAdventureForm] = useState({
    name: "",
    description: "",
  })

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    userId: "",
    displayName: "",
    avatarUrl: "",
    bio: "",
  })

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    userId: "",
    settings: "{}",
  })

  // Load data on component mount
  useEffect(() => {
    loadUsers()
    loadAdventures()
  }, [])

  const loadUsers = async () => {
    try {
      console.log("[v0] Loading users...")
      const response = await fetch("/api/users")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("[v0] Users data received:", data)
      const usersArray = Array.isArray(data) ? data : []
      setUsers(usersArray)
      setError(null)
    } catch (error) {
      console.error("[v0] Error loading users:", error)
      setUsers([])
      setError(`Failed to load users: ${error.message}`)
    }
  }

  const loadAdventures = async () => {
    try {
      console.log("[v0] Loading adventures...")
      const response = await fetch("/api/adventures")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("[v0] Adventures data received:", data)
      const adventuresArray = Array.isArray(data) ? data : []
      setAdventures(adventuresArray)
      setError(null)
    } catch (error) {
      console.error("[v0] Error loading adventures:", error)
      setAdventures([])
      setError(`Failed to load adventures: ${error.message}`)
    }
  }

  const createUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      })
      if (response.ok) {
        setUserForm({ username: "", phoneNumber: "", email: "", level: 1, starScore: 0, gems: 0, penaltyBar: 0 })
        loadUsers()
      }
    } catch (error) {
      console.error("Error creating user:", error)
    }
    setLoading(false)
  }

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" })
      loadUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const createAdventure = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/adventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adventureForm),
      })
      if (response.ok) {
        setAdventureForm({ name: "", description: "" })
        loadAdventures()
      }
    } catch (error) {
      console.error("Error creating adventure:", error)
    }
    setLoading(false)
  }

  const createProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profileForm, userId: Number.parseInt(profileForm.userId) }),
      })
      setProfileForm({ userId: "", displayName: "", avatarUrl: "", bio: "" })
      loadUsers()
    } catch (error) {
      console.error("Error creating profile:", error)
    }
    setLoading(false)
  }

  const createSettings = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number.parseInt(settingsForm.userId),
          settings: JSON.parse(settingsForm.settings),
        }),
      })
      setSettingsForm({ userId: "", settings: "{}" })
      loadUsers()
    } catch (error) {
      console.error("Error creating settings:", error)
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Thunderbolts Database Management</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <p className="text-sm text-red-600 mt-2">
              Check the{" "}
              <a href="/api/test-db" target="_blank" className="underline" rel="noreferrer">
                database test endpoint
              </a>{" "}
              for more details.
            </p>
          </div>
        )}

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="adventures">Adventures</TabsTrigger>
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="user-adventures">User Adventures</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New User</CardTitle>
                  <CardDescription>Add a new user to the database</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createUser} className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={userForm.username}
                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={userForm.phoneNumber}
                        onChange={(e) => setUserForm({ ...userForm, phoneNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="level">Level</Label>
                        <Input
                          id="level"
                          type="number"
                          value={userForm.level}
                          onChange={(e) => setUserForm({ ...userForm, level: Number.parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gems">Gems</Label>
                        <Input
                          id="gems"
                          type="number"
                          value={userForm.gems}
                          onChange={(e) => setUserForm({ ...userForm, gems: Number.parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create User"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Users List</CardTitle>
                  <CardDescription>All registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Array.isArray(users) && users.length > 0 ? (
                      users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{user.username}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary">Level {user.level}</Badge>
                              <Badge variant="outline">{user.gems} gems</Badge>
                            </div>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
                            Delete
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        {error ? "Error loading users" : "No users found"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="adventures" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Adventure</CardTitle>
                  <CardDescription>Add a new adventure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createAdventure} className="space-y-4">
                    <div>
                      <Label htmlFor="adventure-name">Adventure Name</Label>
                      <Input
                        id="adventure-name"
                        value={adventureForm.name}
                        onChange={(e) => setAdventureForm({ ...adventureForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="adventure-description">Description</Label>
                      <Textarea
                        id="adventure-description"
                        value={adventureForm.description}
                        onChange={(e) => setAdventureForm({ ...adventureForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Adventure"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Adventures List</CardTitle>
                  <CardDescription>All available adventures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Array.isArray(adventures) && adventures.length > 0 ? (
                      adventures.map((adventure) => (
                        <div key={adventure.id} className="p-4 border rounded-lg">
                          <h3 className="font-semibold">{adventure.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{adventure.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        {error ? "Error loading adventures" : "No adventures found"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create User Profile</CardTitle>
                <CardDescription>Add profile information for a user</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="profile-user-id">User ID</Label>
                    <Input
                      id="profile-user-id"
                      type="number"
                      value={profileForm.userId}
                      onChange={(e) => setProfileForm({ ...profileForm, userId: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatar-url">Avatar URL</Label>
                    <Input
                      id="avatar-url"
                      value={profileForm.avatarUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create User Settings</CardTitle>
                <CardDescription>Add settings for a user (JSON format)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createSettings} className="space-y-4">
                  <div>
                    <Label htmlFor="settings-user-id">User ID</Label>
                    <Input
                      id="settings-user-id"
                      type="number"
                      value={settingsForm.userId}
                      onChange={(e) => setSettingsForm({ ...settingsForm, userId: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="settings-json">Settings (JSON)</Label>
                    <Textarea
                      id="settings-json"
                      value={settingsForm.settings}
                      onChange={(e) => setSettingsForm({ ...settingsForm, settings: e.target.value })}
                      placeholder='{"theme": "dark", "notifications": true}'
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Settings"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user-adventures" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Adventures</CardTitle>
                <CardDescription>Manage user progress in adventures</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User adventure relationships will be displayed here. This section tracks which users are participating
                  in which adventures and their progress status.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
