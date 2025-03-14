<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Journal\JournalRepository;
use App\Repositories\Program\ProgramRepository;
use App\Repositories\Project\ProjectRepository;
use App\Repositories\WhatsApp\WhatsAppRepository;
use App\Repositories\Department\DepartmentRepository;
use App\Repositories\Program\MailBroadcastRepository;
use App\Repositories\Account\AccountRepositoryInterface;
use App\Repositories\Journal\JournalRepositoryInterface;
use App\Repositories\Program\ProgramRepositoryInterface;
use App\Repositories\Project\ProjectRepositoryInterface;
use App\Repositories\WhatsApp\WhatsAppRepositoryInterface;
use App\Repositories\Department\DepartmentRepositoryInterface;
use App\Repositories\Program\MailBroadcastRepositoryInterface;
use App\Repositories\AccountCategory\AccountCategoryRepository;
use App\Repositories\ContactCategory\ContactCategoryRepository;
use App\Repositories\AccountCategory\AccountCategoryRepositoryInterface;
use App\Repositories\ContactCategory\ContactCategoryRepositoryInterface;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->app->bind(
            AccountRepositoryInterface::class, AccountRepository::class
        );
        $this->app->bind(
            AccountCategoryRepositoryInterface::class, AccountCategoryRepository::class
        );
        $this->app->bind(
            VillageRepositoryInterface::class, VillageRepository::class
        );
        $this->app->bind(
            UserRepositoryInterface::class, UserRepository::class
        );
        $this->app->bind(
            LogRepositoryInterface::class, LogRepository::class
        );
        $this->app->bind(
            JournalRepositoryInterface::class, JournalRepository::class
        );
        $this->app->bind(
            ContactCategoryRepositoryInterface::class, ContactCategoryRepository::class
        );
        $this->app->bind(
            ContactRepositoryInterface::class, ContactRepository::class
        );
        $this->app->bind(
            ProgramRepositoryInterface::class, ProgramRepository::class
        );
        $this->app->bind(
            ProjectRepositoryInterface::class, ProjectRepository::class
        );
        $this->app->bind(
            DepartmentRepositoryInterface::class, DepartmentRepository::class
        );
        $this->app->bind(
            WhatsAppRepositoryInterface::class, WhatsAppRepository::class
        );
        $this->app->bind(
            MailBroadcastRepositoryInterface::class, MailBroadcastRepository::class
        );
    }
}
