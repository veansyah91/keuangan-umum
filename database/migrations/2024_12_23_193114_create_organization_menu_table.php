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
        Schema::create('organization_menu', function (Blueprint $table) {
            
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();

            $table->unsignedBigInteger('menu_id');
            $table->foreign('menu_id')->references('id')->on('menus');

            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organization_menu');
    }
};
