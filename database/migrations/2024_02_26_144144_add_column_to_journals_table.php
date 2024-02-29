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
        Schema::table('journals', function (Blueprint $table) {
            $table->unsignedBigInteger('project_id')->nullable();          
            $table->foreign('project_id')->references('id')->on('projects');

            $table->unsignedBigInteger('program_id')->nullable();          
            $table->foreign('program_id')->references('id')->on('programs');

            $table->unsignedBigInteger('department_id')->nullable();          
            $table->foreign('department_id')->references('id')->on('departments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('journals', function (Blueprint $table) {
            //
        });
    }
};
