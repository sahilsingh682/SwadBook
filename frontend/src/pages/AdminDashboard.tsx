import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Check,
  X,
  Eye,
  Clock,
  TrendingUp,
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  UserX,
  UserCheck,
  ChefHat,
  Pencil,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  preparation_time: number;
  image_url: string | null;
  author_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  meal_type: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  profiles: {
    name: string;
  } | null;
}

interface UserProfile {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'banned';
  suspension_reason: string | null;
  created_at: string;
  role: 'admin' | 'user';
  recipes_count?: number;
}

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // State: Data
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State: Recipe Filters
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeStatusFilter, setRecipeStatusFilter] = useState<string>('pending');
  const [recipeMealFilter, setRecipeMealFilter] = useState<string>('all');

  // State: User Filters
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // State: Modals & Actions
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedUserForSuspend, setSelectedUserForSuspend] = useState<UserProfile | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [deleteRecipeId, setDeleteRecipeId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user && isAdmin) {
      loadAllData();
    }
  }, [user, isAdmin]);

  const loadAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchRecipes(), fetchUsers()]);
    setIsLoading(false);
  };

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          id, title, ingredients, preparation_time, image_url, author_id,
          status, created_at, meal_type, calories, protein, carbs, fat,
          profiles:author_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes((data as unknown as Recipe[]) || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes for moderation');
    }
  };

  const fetchUsers = async () => {
    try {
      // 1. Fetch profiles
      const { data: profilesData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileErr) throw profileErr;

      // 2. Fetch roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role');

      const roleMap = new Map<string, 'admin' | 'user'>();
      (rolesData || []).forEach((r) => {
        if (r.role === 'admin') roleMap.set(r.user_id, 'admin');
        else if (!roleMap.has(r.user_id)) roleMap.set(r.user_id, 'user');
      });

      // 3. Count recipes per author
      const { data: recipesData } = await supabase
        .from('recipes')
        .select('author_id');

      const countMap = new Map<string, number>();
      (recipesData || []).forEach((rec) => {
        countMap.set(rec.author_id, (countMap.get(rec.author_id) || 0) + 1);
      });

      const combinedUsers: UserProfile[] = (profilesData || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        status: (p.status as 'active' | 'suspended' | 'banned') || 'active',
        suspension_reason: p.suspension_reason || null,
        created_at: p.created_at,
        role: roleMap.get(p.id) || 'user',
        recipes_count: countMap.get(p.id) || 0,
      }));

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load user management list');
    }
  };

  // -------------------------------------------------------------
  // Recipe Moderation Actions
  // -------------------------------------------------------------
  const handleModerateRecipe = async (recipeId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ status })
        .eq('id', recipeId);

      if (error) throw error;

      toast.success(
        status === 'approved'
          ? 'Recipe approved & published to platform!'
          : 'Recipe rejected & hidden from public view'
      );
      setRecipes((prev) =>
        prev.map((r) => (r.id === recipeId ? { ...r, status } : r))
      );
    } catch (error) {
      console.error('Error updating recipe status:', error);
      toast.error('Failed to update recipe status');
    }
  };

  const handleDeleteRecipe = async () => {
    if (!deleteRecipeId) return;
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', deleteRecipeId);

      if (error) throw error;

      toast.success('Recipe permanently deleted');
      setRecipes((prev) => prev.filter((r) => r.id !== deleteRecipeId));
      setDeleteRecipeId(null);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  // -------------------------------------------------------------
  // User Management Actions (Hold / Suspend, Activate, Delete)
  // -------------------------------------------------------------
  const openSuspendDialog = (userItem: UserProfile) => {
    setSelectedUserForSuspend(userItem);
    setSuspensionReason(userItem.suspension_reason || '');
    setSuspendModalOpen(true);
  };

  const handleConfirmSuspend = async () => {
    if (!selectedUserForSuspend) return;
    setActionLoading(true);
    try {
      const reason = suspensionReason.trim() || 'Violation of platform community guidelines';
      const { error } = await supabase
        .from('profiles')
        .update({
          status: 'suspended',
          suspension_reason: reason,
        })
        .eq('id', selectedUserForSuspend.id);

      if (error) throw error;

      toast.success(`Account for ${selectedUserForSuspend.name} has been placed on HOLD`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserForSuspend.id
            ? { ...u, status: 'suspended', suspension_reason: reason }
            : u
        )
      );
      setSuspendModalOpen(false);
    } catch (error) {
      console.error('Error placing user on hold:', error);
      toast.error('Failed to place account on hold');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateUser = async (userItem: UserProfile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          status: 'active',
          suspension_reason: null,
        })
        .eq('id', userItem.id);

      if (error) throw error;

      toast.success(`Account for ${userItem.name} has been REINSTATED`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userItem.id ? { ...u, status: 'active', suspension_reason: null } : u
        )
      );
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('Failed to activate user');
    }
  };

  const handleToggleAdminRole = async (userItem: UserProfile) => {
    const isCurrentlyAdmin = userItem.role === 'admin';
    const newRole = isCurrentlyAdmin ? 'user' : 'admin';

    try {
      if (isCurrentlyAdmin) {
        // Demote: remove admin role from user_roles
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userItem.id)
          .eq('role', 'admin');
        if (error) throw error;
      } else {
        // Promote: insert admin role into user_roles
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userItem.id,
            role: 'admin',
          });
        if (error) throw error;
      }

      toast.success(
        `Updated role for ${userItem.name} to ${newRole.toUpperCase()}`
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === userItem.id ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to change user role');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deleteUserId);

      if (error) throw error;

      toast.success('User profile removed from platform');
      setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
      setDeleteUserId(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to remove user account');
    }
  };

  // -------------------------------------------------------------
  // Filtered Lists
  // -------------------------------------------------------------
  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      (r.profiles?.name || '').toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.ingredients.some((ing) => ing.toLowerCase().includes(recipeSearch.toLowerCase()));
    const matchesStatus =
      recipeStatusFilter === 'all' || r.status === recipeStatusFilter;
    const matchesMeal =
      recipeMealFilter === 'all' || r.meal_type === recipeMealFilter;
    return matchesSearch && matchesStatus && matchesMeal;
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase());
    const matchesStatus =
      userStatusFilter === 'all' || u.status === userStatusFilter;
    const matchesRole =
      userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Stats calculation
  const totalRecipes = recipes.length;
  const pendingRecipesCount = recipes.filter((r) => r.status === 'pending').length;
  const approvedRecipesCount = recipes.filter((r) => r.status === 'approved').length;
  const rejectedRecipesCount = recipes.filter((r) => r.status === 'rejected').length;

  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const suspendedUsersCount = users.filter((u) => u.status === 'suspended').length;

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold font-display mb-2">Access Restricted</h2>
          <p className="text-sm text-muted-foreground mb-6">
            You must have administrator privileges to view this control panel.
          </p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Admin Control Center
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Verify community recipes, moderate content violations, and manage user accounts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllData}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button size="sm" onClick={() => navigate('/upload')} className="shadow-warm">
            Upload Official Recipe
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-display font-bold text-amber-500">
                {pendingRecipesCount}
              </div>
              {pendingRecipesCount > 0 && (
                <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 text-xs animate-pulse">
                  Action Required
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Approved Recipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-emerald-500">
              {approvedRecipesCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {totalRecipes} total submitted
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-primary">
              {activeUsersCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered food creators
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Accounts On Hold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-display font-bold text-destructive">
                {suspendedUsersCount}
              </div>
              {suspendedUsersCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  Suspended
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="recipes" className="space-y-6">
        <TabsList className="grid grid-cols-2 max-w-md h-11 p-1 bg-muted/60 rounded-xl">
          <TabsTrigger value="recipes" className="gap-2 text-sm font-medium">
            <ChefHat className="h-4 w-4" />
            <span>Recipe Moderation</span>
            {pendingRecipesCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-amber-500 text-white text-[10px] rounded-full">
                {pendingRecipesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2 text-sm font-medium">
            <Users className="h-4 w-4" />
            <span>User Management</span>
            {suspendedUsersCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] rounded-full">
                {suspendedUsersCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* -------------------------------------------------------- */}
        {/* TAB 1: RECIPE MODERATION */}
        {/* -------------------------------------------------------- */}
        <TabsContent value="recipes" className="space-y-4">
          <Card className="border shadow-card">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-display font-semibold">
                    Recipe Moderation Queue
                  </CardTitle>
                  <CardDescription>
                    Review incoming recipes before they are listed publicly. Authors only see approved recipes in the main feed.
                  </CardDescription>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by recipe title, chef, or ingredient..."
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>

                <Select value={recipeStatusFilter} onValueChange={setRecipeStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[170px] h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses ({totalRecipes})</SelectItem>
                    <SelectItem value="pending">Pending Review ({pendingRecipesCount})</SelectItem>
                    <SelectItem value="approved">Approved ({approvedRecipesCount})</SelectItem>
                    <SelectItem value="rejected">Rejected ({rejectedRecipesCount})</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={recipeMealFilter} onValueChange={setRecipeMealFilter}>
                  <SelectTrigger className="w-full sm:w-[150px] h-10">
                    <SelectValue placeholder="Meal Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Meals</SelectItem>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="py-16 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  <span>Loading moderation queue...</span>
                </div>
              ) : filteredRecipes.length === 0 ? (
                <div className="py-16 text-center">
                  <ChefHat className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <h3 className="font-semibold text-base mb-1">No recipes found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {recipeStatusFilter === 'pending'
                      ? 'No pending recipes waiting for verification. All submissions are up to date!'
                      : 'No recipes match your current search and filter settings.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y border rounded-xl overflow-hidden bg-card">
                  {filteredRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
                          {recipe.image_url ? (
                            <img
                              src={recipe.image_url}
                              alt={recipe.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                              <ChefHat className="h-8 w-8" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-display font-semibold text-lg truncate">
                              {recipe.title}
                            </h4>

                            {recipe.status === 'pending' && (
                              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-xs font-medium">
                                Pending Verification
                              </Badge>
                            )}
                            {recipe.status === 'approved' && (
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs font-medium">
                                Approved & Listed
                              </Badge>
                            )}
                            {recipe.status === 'rejected' && (
                              <Badge variant="destructive" className="text-xs font-medium">
                                Rejected
                              </Badge>
                            )}

                            {recipe.meal_type && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {recipe.meal_type}
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span>By <strong>{recipe.profiles?.name || 'Unknown Chef'}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {recipe.preparation_time} min
                            </span>
                            <span>•</span>
                            <span>{recipe.ingredients.length} ingredients</span>
                            {recipe.calories && (
                              <>
                                <span>•</span>
                                <span>{recipe.calories} kcal</span>
                              </>
                            )}
                          </div>

                          {/* Ingredient tags */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {recipe.ingredients.slice(0, 4).map((ing, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 rounded-md bg-muted text-[11px] text-muted-foreground font-mono"
                              >
                                {ing}
                              </span>
                            ))}
                            {recipe.ingredients.length > 4 && (
                              <span className="text-[11px] text-muted-foreground/70 self-center">
                                +{recipe.ingredients.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/recipe/${recipe.id}`)}
                          className="h-9 gap-1.5"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
                          className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>

                        {recipe.status !== 'approved' && (
                          <Button
                            size="sm"
                            onClick={() => handleModerateRecipe(recipe.id, 'approved')}
                            className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm"
                          >
                            <Check className="h-4 w-4" />
                            <span>Approve</span>
                          </Button>
                        )}

                        {recipe.status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleModerateRecipe(recipe.id, 'rejected')}
                            className="h-9 gap-1.5"
                          >
                            <X className="h-4 w-4" />
                            <span>Reject</span>
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteRecipeId(recipe.id)}
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                          title="Delete Recipe"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------------------------------------------------------- */}
        {/* TAB 2: USER ACCOUNT MANAGEMENT */}
        {/* -------------------------------------------------------- */}
        <TabsContent value="users" className="space-y-4">
          <Card className="border shadow-card">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-xl font-display font-semibold">
                  Community Member Governance
                </CardTitle>
                <CardDescription>
                  Protect platform integrity. Hold or suspend accounts flagged for policy violations, promote administrators, or remove abusive users.
                </CardDescription>
              </div>

              {/* User Filters */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user name or ID..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>

                <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[170px] h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses ({totalUsersCount})</SelectItem>
                    <SelectItem value="active">Active ({activeUsersCount})</SelectItem>
                    <SelectItem value="suspended">On Hold ({suspendedUsersCount})</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[150px] h-10">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                    <SelectItem value="user">Standard Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="py-16 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  <span>Loading user directory...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <h3 className="font-semibold text-base mb-1">No users found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search criteria or filters.
                  </p>
                </div>
              ) : (
                <div className="divide-y border rounded-xl overflow-hidden bg-card">
                  {filteredUsers.map((userItem) => {
                    const isSelf = userItem.id === user.id;
                    const isSuspended = userItem.status === 'suspended';

                    return (
                      <div
                        key={userItem.id}
                        className={`p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-colors ${
                          isSuspended ? 'bg-destructive/5' : 'hover:bg-muted/30'
                        }`}
                      >
                        {/* User Identity */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm ${
                            isSuspended
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {userItem.name.slice(0, 2).toUpperCase() || 'U'}
                          </div>

                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-base truncate">
                                {userItem.name}
                              </span>

                              {isSelf && (
                                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                  You
                                </Badge>
                              )}

                              {userItem.role === 'admin' ? (
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold gap-1">
                                  <ShieldCheck className="h-3 w-3" />
                                  Admin
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Member
                                </Badge>
                              )}

                              {isSuspended ? (
                                <Badge variant="destructive" className="text-xs gap-1 font-medium">
                                  <AlertTriangle className="h-3 w-3" />
                                  Account On Hold
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="font-mono text-[11px] truncate max-w-[180px] sm:max-w-none">
                                ID: {userItem.id}
                              </span>
                              <span>•</span>
                              <span>{userItem.recipes_count || 0} recipes submitted</span>
                              <span>•</span>
                              <span>
                                Joined {new Date(userItem.created_at).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Violation Reason if on hold */}
                            {isSuspended && userItem.suspension_reason && (
                              <div className="mt-2 text-xs p-2 rounded-md bg-destructive/10 text-destructive border border-destructive/20 flex items-start gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                                <span>
                                  <strong>Hold Reason:</strong> {userItem.suspension_reason}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* User Actions */}
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0">
                          {/* Hold / Reinstate Account */}
                          {!isSelf && (
                            <>
                              {isSuspended ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleActivateUser(userItem)}
                                  className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                                >
                                  <UserCheck className="h-4 w-4" />
                                  <span>Reinstate Account</span>
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openSuspendDialog(userItem)}
                                  className="h-9 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                                >
                                  <UserX className="h-4 w-4" />
                                  <span>Hold Account</span>
                                </Button>
                              )}

                              {/* Toggle Role */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleToggleAdminRole(userItem)}
                                className="h-9 text-xs text-muted-foreground hover:text-foreground"
                              >
                                {userItem.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                              </Button>

                              {/* Delete User */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteUserId(userItem.id)}
                                className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                                title="Remove User Profile"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ------------------------------------------------------------- */}
      {/* DIALOG: Suspend / Put User On Hold */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={suspendModalOpen} onOpenChange={setSuspendModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-display text-xl font-bold">
              Place Account On Hold
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Temporarily restrict <strong>{selectedUserForSuspend?.name}</strong> from uploading recipes, rating dishes, and posting comments.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="suspension-reason" className="text-sm font-medium">
              Reason for Violation / Hold
            </Label>
            <Input
              id="suspension-reason"
              placeholder="e.g. Uploaded spam recipes, abusive comments..."
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              This note will be visible in the admin audit log and displayed to the user when they attempt to perform restricted actions.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="ghost"
              onClick={() => setSuspendModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmSuspend}
              disabled={actionLoading}
            >
              {actionLoading ? 'Updating...' : 'Confirm Hold'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------- */}
      {/* ALERT DIALOG: Delete Recipe */}
      {/* ------------------------------------------------------------- */}
      <AlertDialog
        open={!!deleteRecipeId}
        onOpenChange={(open) => !open && setDeleteRecipeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete Recipe?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the recipe, its ratings, and all comments permanently. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRecipe}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Recipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ------------------------------------------------------------- */}
      {/* ALERT DIALOG: Delete User */}
      {/* ------------------------------------------------------------- */}
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this member's profile and their associated recipes and favorites from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
