<?php

namespace App\Repositories\Project;

use App\Models\Project;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function getData($organizationId)
    {
        $excpection = ['finished','no started'];
        return Project::whereNotIn('status', $excpection)
                ->whereOrganizationId($organizationId)
                ->select('id', 'name', 'code')
                ->get();
    }
}
