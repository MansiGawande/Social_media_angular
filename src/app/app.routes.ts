// import { Routes } from '@angular/router';
// import { SignupComponent } from './signup/signup.component';
// import { SigninComponent } from './signin/signin.component';
// import { UdashboardComponent } from './udashboard/udashboard.component';
// import { ProfileComponent } from './profile/profile.component';
// import { ContentComponent } from './content/content.component';

// export const routes: Routes = [
//     {path:'signup', component: SignupComponent },
//     {path:"",component:SigninComponent},
//     // {path:"*",component:UdashboardComponent},
//     // {path:",",component:ProfileComponent}
//     { path: 'dashboard', component: UdashboardComponent, children: [
//         { path: 'profile', component: ProfileComponent },
//         { path: 'content', component: ContentComponent },

//         { path: '', redirectTo: 'content', pathMatch: 'full' }
//     ]}  
// ];
// import { PreventDuplicateRouteGuard } from './guards/prevent-duplicate-route.guard'; 

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

export const routes: Routes = [
    { path: 'signup', component: SignupComponent },
    { path: '', component: SigninComponent },
    {path:'cpro',component:CreateProfileComponent},
    {path:'cpost',component:CreatepostComponent},
    {path:'comment',component:CommentsComponent},
    // {path:'viewpro', component:ViewproComponent},
    {
        path: 'udashboard', component: UdashboardComponent, children: [
            { path: 'profile', component: ProfileComponent },
            { path: 'content', component: ContentComponent },
            { path: '', redirectTo: 'content', pathMatch: 'full' }
        ]
    }
]


