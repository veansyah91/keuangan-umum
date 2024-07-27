<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('salary_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->bigInteger('value')->default(0);
            $table->integer('hour')->nullable();
            $table->boolean('has_hour')->default(false);
            $table->boolean('is_cut')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary_categories');
    }
};
