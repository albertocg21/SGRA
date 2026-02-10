<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class AuditObserver
{
    public function created($model)
    {
        $this->logAction('created', $model);
    }

    public function updated($model)
    {
        $this->logAction('updated', $model);
    }

    public function deleted($model)
    {
        $this->logAction('deleted', $model);
    }

    private function logAction($action, $model)
    {
        if (Auth::check()) {
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $action . ' ' . class_basename($model),
                'details' => json_encode($model->toArray()),
                'ip_address' => request()->ip(),
            ]);
        }
    }
}
