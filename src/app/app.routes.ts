

import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { UdashboardComponent } from './udashboard/udashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ContentComponent } from './content/content.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ViewproComponent } from './viewpro/viewpro.component';
import { CreatepostComponent } from './createpost/createpost.component';
import { CommentsComponent } from './comments/comments.component';
import { SelfProfileComponent } from './self-profile/self-profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RecommendationComponent } from './recommendation/recommendation.component';

export const routes: Routes = [
    { path: 'signup', component: SignupComponent },
    { path: '', component: SigninComponent },
    {path:'cpro',component:CreateProfileComponent},
    {path:'cpost',component:CreatepostComponent},
    {path:'comments/:post_id',component:CommentsComponent},
    // {path:'viewpro', component:ViewproComponent},
    { path: 'profile/:profile_id', component: ProfileComponent }, // other profile
    // {path:'adminDashboard',component:AdminDashboardComponent},
    
    {
        path: 'udashboard', component: UdashboardComponent, children: [
            { path: 'profile', component: SelfProfileComponent },
            { path: 'content', component: ContentComponent },
            {path:'cpost',component: CreatepostComponent},
            {path:'suggest',component:RecommendationComponent},
            
            { path: '', redirectTo: 'content', pathMatch: 'full' }
        ]
    },
]


