<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;
use App\Repositories\User\UserRepository;
use Illuminate\Auth\Access\Response;

class OrganizationPolicy
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Organization $organization): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Organization $organization): Response
    {
        $organization = $this->userRepository->getOrganization($user['id'], $organization['id']);
        $role = $organization->organizations[0]['pivot']['role'];

        return ($role === 'admin' || $role === 'editor')
                ? Response::allow()
                : Response::denyWithStatus(403);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Organization $organization): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Organization $organization): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Organization $organization): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Organization $organization): bool
    {
        //
    }
}
